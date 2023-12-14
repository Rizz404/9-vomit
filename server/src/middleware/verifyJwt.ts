import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import admin from "../config/firebaseConfig";
import User from "../models/User";
import mongoose from "mongoose";

interface ReqUser {
  id: mongoose.Schema.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  roles: "Admin" | "User";
}

declare global {
  namespace Express {
    interface Request {
      user: ReqUser;
    }
  }
}

const verifyJwt: RequestHandler = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = req.cookies.jwt;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      if (!decoded.userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = await User.findById(decoded.userId).select("-password");
    } else if (authorization !== "Bearer null" && authorization?.startsWith("Bearer ")) {
      const idToken = authorization.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      if (!decodedToken.uid) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = await User.findById(decodedToken.uid).select("-password");
    }

    next();
  } catch (error) {
    res.status(401).json(error);
  }
};

export default verifyJwt;
