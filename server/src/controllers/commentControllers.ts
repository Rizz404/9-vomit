import { RequestHandler } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";
import deleteFile from "../util/deleteFile";

export const addComment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { postId, parentId } = req.params;
    const { content } = req.body;
    const image = req.file;
    const newCommentData: any = {
      userId: id,
      postId: postId,
      content,
      image: image ? image.filename : undefined,
      repliedTo: parentId || parentId !== "" || parentId !== null ? parentId : undefined,
    };

    const newComment = new Comment(newCommentData);
    const savedComment = await newComment.save();
    // * Ternyata bisa count document seperti ini, ilmu baru
    const commentsCount = await Comment.countDocuments({ postId: savedComment.postId });

    if (parentId || parentId !== "" || parentId !== null) {
      const replies = await Comment.countDocuments({ repliedTo: parentId });

      await Comment.findByIdAndUpdate({ _id: parentId }, { repliesCount: replies });
    }
    // ! Tambahkan ke comments count di post
    await Post.findByIdAndUpdate({ _id: savedComment.postId }, { commentsCount });
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ messsage: error.messsage });
  }
};

export const getPostComments: RequestHandler = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId, repliedTo: "" || undefined || null })
      .sort({ createdAt: -1 })
      .populate("userId", "username email fullname profilePict");

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComment: RequestHandler = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId).populate(
      "userId",
      "username email fullname profilePict"
    );

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReplies: RequestHandler = async (req, res) => {
  try {
    const { commentId } = req.params;
    const replies = await Comment.find({ repliedTo: commentId }).populate(
      "userId",
      "username email fullname profilePict"
    );

    res.json(replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComment: RequestHandler = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const image = req.file;
    const comment = await Comment.findById(commentId);

    comment.content = content || comment.content;
    if (image) {
      if (comment.image) {
        await deleteFile("images", comment.image);
      }
      comment.image = image.filename;
    }
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ messsage: error.messsage });
  }
};

export const deleteComment: RequestHandler = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    const comments = (await Comment.find({ postId: comment.postId })).length;

    comment.image && (await deleteFile("image", comment.image));
    await comment.deleteOne();
    await Post.findByIdAndUpdate({ _id: comment.postId }, { commentsCount: comments });
    res.json({ message: "Successfully deleted comment" });
  } catch (error) {
    res.status(500).json({ messsage: error.messsage });
  }
};

export const votes: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { action, commentId } = req.params;

    if (!["upvote", "downvote"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    // * Menentukan field mana yang harus diperbarui berdasarkan action
    // * Kan params singular, kalo field itu plural, jadi tinggal tambahin s
    const voteField = action + "s";
    const oppositeVoteField = action === "upvote" ? "downvotes" : "upvotes";

    // * Cari postingan dan perbarui dalam satu operasi secara atomicly
    const updatedVote = await Comment.findByIdAndUpdate(
      { _id: commentId },
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
