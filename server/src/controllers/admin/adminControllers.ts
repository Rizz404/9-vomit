import { RequestHandler } from "express";
import User from "../../models/User";
import mongoose from "mongoose";

interface Roles {
  roles: "User" | "Admin";
}

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const user = await User.find();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeRole: RequestHandler = async (req, res) => {
  try {
    const { id } = req.user;
    const admin = await User.findById(id);

    if (admin.roles !== "Admin") return res.status(401).json({ message: "Admin access required" });

    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: `User with ${userId} not found!` });

    const { roles }: Roles = req.body;

    if (roles !== "User" && roles !== "Admin") {
      return res.status(400).json({ message: "Only assignable to User and Admin" });
    }

    user.roles = roles || user.roles;
    const updatedRole = await user.save();

    res.json(updatedRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
