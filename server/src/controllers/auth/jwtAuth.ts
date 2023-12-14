import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User";

// todo: Error handler harus lebih bisa dibaca dan lebih detail

interface AuthBody {
  username: string;
  email: string;
  password: string;
}

export const register: RequestHandler = async (req, res) => {
  try {
    const { username, email, password }: AuthBody = req.body;
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (!(username || email) || !password) {
      return res.status(400).json({ message: "Missing required field!" });
    }

    if (existingUsername) return res.status(400).json({ message: "Username already taken" });
    if (existingEmail) return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({
      username,
      email,
      password,
    });
    const savedUser = await newUser.save();

    res.status(201).json({ message: `User ${savedUser.username} has been created` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { username, email, password }: AuthBody = req.body;

    if (!(username || email) || !password) {
      return res.status(400).json({ message: "Missing required field!" });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) return res.status(401).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: "Password does not match" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // ! Membuat cookie bertahan 30 hari
    });
    res.json({
      // ! ini diganti dari id ke _id, gatau problem yang muncul dimana
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      fullname: user.fullname,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    const token: string = req.cookies.jwt;

    if (!token) return res.status(204).json({ message: "You already logout" });

    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
