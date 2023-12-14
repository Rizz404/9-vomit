import { RequestHandler } from "express";
import Tag from "../models/Tag";
import Post from "../models/Post";

export const getTags: RequestHandler = async (req, res) => {
  try {
    const { category } = req.params;
    let tags: any;

    switch (category) {
      case "featured-tag":
        tags = await Tag.find().limit(10).sort({ postsCount: -1 }).select("name");
        break;
      case "all":
        tags = await Tag.find();
        break;

      default:
        tags = await Tag.find();
        break;
    }

    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTag: RequestHandler = async (req, res) => {
  try {
    const { tagId } = req.params;
    const tag = await Tag.findById(tagId);

    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchTagsByName: RequestHandler = async (req, res) => {
  try {
    const { name, page = "1" } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;
    const tag = await Tag.find({ name: { $regex: name, $options: "i" } })
      .limit(limit)
      .skip(skip)
      .select("name postsCount");

    if (tag.length === 0) {
      return res.status(404).json({ message: `No tag named ${name}` });
    }

    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostsByTag: RequestHandler = async (req, res) => {
  try {
    const { name } = req.params;
    const { page = "1" } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;
    const tags = await Tag.findOne({ name });

    if (!tags) {
      return res.status(404).json({ message: `Tag ${name} not found` });
    }

    const posts = await Post.find({ tags: { $in: [tags._id] } })
      .populate("userId", "username email fullname profilePict")
      .populate("tags", "name")
      .limit(limit)
      .skip(skip);

    if (posts.length === 0) {
      return res.status(404).json({ message: `No posts found with tag ${name}` });
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
