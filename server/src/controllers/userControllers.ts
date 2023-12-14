import { RequestHandler } from "express";
import User from "../models/User";
import mongoose from "mongoose";
import deleteFile from "../util/deleteFile";
import bcrypt from "bcrypt";

export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: `User with ${id} not found!` });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: `User with ${userId} not found!` });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: `User with ${id} not found!` });

    const { username, email, password, fullname, bio } = req.body;
    // ! ternyata hanya req.file bukan req.file + nama fieldnya, aku tolol sekali
    const profilePict = req.file;

    // todo: untuk yang confirm password itumah di react saja
    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.fullname = fullname || user.fullname;
    user.bio = bio || user.bio;

    if (profilePict) {
      // * Menggunakan path file yang diunggah untuk profilePict
      if (user.profilePict) {
        await deleteFile("profilePict", user.profilePict);
      }
      user.profilePict = profilePict.filename;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      roles: updatedUser.roles,
      fullname: updatedUser.fullname,
      bio: updatedUser.bio,
      profilePict: updatedUser.profilePict,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followOrUnfollowAndUpdateFollowers: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const { friendId } = req.params;

    const updatedFriend = await User.findOneAndUpdate(
      { _id: id },
      [
        {
          $addFields: {
            isFollowed: { $in: [friendId, "$following"] },
          },
        },
        {
          $addFields: {
            following: {
              $cond: [
                "$isFollowed",
                { $setDifference: ["$following", [friendId]] },
                { $concatArrays: ["$following", [friendId]] },
              ],
            },
          },
        },
      ],
      { new: true }
    );

    const updatedUser = await User.findOneAndUpdate(
      { _id: friendId },
      [
        {
          $addFields: {
            isFollower: { $in: [id, "$followers"] },
          },
        },
        {
          $addFields: {
            followers: {
              $cond: [
                "$isFollower",
                { $setDifference: ["$followers", [id]] },
                { $concatArrays: ["$followers", [id]] },
              ],
            },
          },
        },
      ],
      { new: true }
    );

    res.json({ updatedFriend, updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFriends: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    const friendIds = user.following;
    const friends = await User.find({ _id: { $in: friendIds } });

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// * Sudah perfect intinya searchbarnya jagan diganggu gugat
export const searchAllUserByQuery: RequestHandler = async (req, res) => {
  try {
    const { username, email, page = "1" } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    // todo: Pelajari lagi tentang $option dan $regex
    let user: any;

    if (username) {
      user = await User.find({ username: { $regex: username, $options: "i" } })
        .select("_id username") // * Hanya menampilkan id dan usernamenya
        .limit(limit)
        .skip(skip);
    } else if (email) {
      user = await User.find({ email: { $regex: email, $options: "i" } })
        .select("_id email") // * Hanya menampilkan id dan emailnya
        .limit(limit)
        .skip(skip);
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUserByQuery: RequestHandler = async (req, res) => {
  try {
    const { username, email } = req.query;
    let user: any;

    if (username) {
      user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, "i") } }).select(
        "_id username"
      );
    } else if (email) {
      user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } }).select(
        "_id email"
      );
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchPasswordAndCompare: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    const { password } = req.query;
    const stringPassword = String(password);
    const match = await bcrypt.compare(stringPassword, user.password);

    if (!match) return res.status(400).json({ message: "Password does not match" });

    res.json({ message: "Password match" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
