import { RequestHandler } from "express";
import Post, { PostDocument } from "../models/Post";
import User from "../models/User";
import Tag, { TagDocument } from "../models/Tag";
import { FilterQuery, SortOrder } from "mongoose";
import deleteFile from "../util/deleteFile";
import Comment from "../models/Comment";

interface PostBody {
  title: string;
  description: string;
  tags: string;
}

export const createPost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { title, description, tags }: PostBody = req.body;
    const images = req.files;

    if (!title || !description) return res.status(400).json({ message: "Missing required field" });

    let tagObjs = [];
    if (tags) {
      //* Pisahkan tag dengan koma dan buang spasi ekstra
      const tagArray = tags.split(",").map((tag) => tag.trim());

      //* Cari atau buat tag baru
      tagObjs = await Promise.all(
        tagArray.map(async (tag) => {
          let tagObj = await Tag.findOne({ name: tag });

          if (!tagObj) {
            tagObj = await Tag.create({ name: tag });
          }

          return tagObj;
        })
      );
    }

    const newPostData: any = {
      userId: id,
      title,
      description,
      tags: tagObjs.map((tagObj) => tagObj.id),
    };

    // @ts-ignore
    if (images && images.length > 0) {
      // @ts-ignore
      newPostData.images = images.map((image: { filename: string }) => image.filename);
    }

    const newPost = new Post(newPostData);

    await newPost.save();
    await Promise.all(
      tagObjs.map(async (tagObj: TagDocument) => {
        // * Sebenarnya newPost saja sudah otomatis memasukkan id dari post
        // * Tapi karena typescript error jadinya newPost._id
        tagObj.posts.push(newPost._id);
        tagObj.postsCount = tagObj.posts.length;
        await tagObj.save();
      })
    );

    return res.json({ message: "Successfully added post" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPostsByCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { page = "1" } = req.query;
    const limit = 20;
    const skip = (Number(page) - 1) * limit;

    const { postsCategory, userId } = req.params;
    const user = await User.findById(id);

    // ! yang panjang cuma typenya jangan bingung
    const getPosts = async (
      query: FilterQuery<PostDocument>,
      sort: string | { [key: string]: SortOrder | { $meta: any } } | [string, SortOrder][]
    ) => {
      return await Post.find(query)
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .populate("userId", "username email fullname profilePict")
        .populate("tags", "name");
    };
    let posts: any;

    switch (postsCategory) {
      case "home":
        posts = id
          ? await getPosts(
              {
                $or: [{ userId: { $in: user.following } }, { userId: user._id }],
              },
              { createdAt: -1 }
            )
          : await getPosts({}, { createdAt: -1 });
        break;

      case "top":
        posts = await getPosts({}, { "upvotes.count": -1 });
        break;

      case "trending":
        posts = await getPosts({}, { "upvotes.count": -1, createdAt: -1 });
        break;

      case "fresh":
        const friendPosts = await getPosts({ userId: { $in: user.following } }, { createdAt: -1 });
        const otherPosts = await getPosts({ userId: { $nin: user.following } }, { createdAt: -1 });

        posts = id ? [...friendPosts, ...otherPosts] : await getPosts({}, { createdAt: -1 });
        break;

      case "self":
        posts = await getPosts({ userId: id }, { createdAt: -1 });
        break;

      case "user":
        if (!userId) return res.status(400).json({ message: "Missing user ID" });

        posts = await getPosts({ userId }, { createdAt: -1 });
        break;

      default:
        break;
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPost: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("userId", "username email fullname profilePict")
      .populate("tags", "name");

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const votes: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { action, postId } = req.params;

    if (!["upvote", "downvote"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    // * Menentukan field mana yang harus diperbarui berdasarkan action
    // * Kan params singular, kalo field itu plural, jadi tinggal tambahin s
    const voteField = action + "s";
    const oppositeVoteField = action === "upvote" ? "downvotes" : "upvotes";

    // * Cari postingan dan perbarui dalam satu operasi secara atomicly
    const updatedVote = await Post.findByIdAndUpdate(
      { _id: postId },
      [
        {
          // * Menambahkan field baru untuk mengecek apakah user sudah upvote atau belum
          $addFields: {
            isVoted: { $in: [id, `$${voteField}.userId`] },
            isOppositeVoted: { $in: [id, `$${oppositeVoteField}.userId`] },
          },
        },
        {
          // * Memperbarui field berdasarkan apakah user sudah memberikan vote atau tidak
          $addFields: {
            [`${voteField}.userId`]: {
              $cond: [
                "$isVoted",
                { $setDifference: [`$${voteField}.userId`, [id]] },
                { $concatArrays: [`$${voteField}.userId`, [id]] },
              ],
            },
            [`${oppositeVoteField}.userId`]: {
              $cond: [
                "$isOppositeVoted",
                { $setDifference: [`$${oppositeVoteField}.userId`, [id]] },
                {
                  $cond: [
                    "$isVoted",
                    { $setDifference: [`$${oppositeVoteField}.userId`, [id]] },
                    `$${oppositeVoteField}.userId`,
                  ],
                },
              ],
            },
          },
        },
        {
          // * Menghitung jumlah vote
          $addFields: {
            [`${voteField}.count`]: { $size: `$${voteField}.userId` },
            [`${oppositeVoteField}.count`]: { $size: `$${oppositeVoteField}.userId` },
          },
        },
      ],
      { new: true }
    );

    if (!updatedVote) return res.status(404).json({ message: "Post not found" });

    res.json(updatedVote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPostsByTitle: RequestHandler = async (req, res) => {
  try {
    // * kalau post tidak ada lebih baik mengembalikan array kosong dari pada 404
    const { title, page = "1" } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    const posts =
      title.toString().trim() !== "" &&
      (await Post.find({ title: { $regex: title, $options: "i" } })
        .limit(limit)
        .skip(skip)
        .populate("userId", "username email fullname profilePict")
        .populate("tags", "name"));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndDelete(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.images || post.images.length <= 0) {
      post.images.forEach(async (image) => await deleteFile("images", image));
    }

    await Comment.deleteMany({ postId });
    await Tag.updateMany({ posts: postId }, { $pull: { posts: postId } });

    res.json({ message: `Successfully deleted post with id ${post._id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
