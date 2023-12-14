import { RequestHandler } from "express";
import User from "../../models/User";
import admin from "../../config/firebaseConfig";

export const googleLogin: RequestHandler = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await User.findById(decodedToken);

    if (!user) {
      const newUser = new User({
        _id: decodedToken.uid,
        username: decodedToken.name,
        email: decodedToken.email,
      });

      await newUser.save();
    }
    res.json({ uid: decodedToken.uid });
  } catch (error) {
    res.status(500).json({ message: `Error verifying ID token: ${error}` });
  }
};

export const logout: RequestHandler = (req, res) => {
  // * Logout disini hanya dihandle di frontend
  return res.json({ message: "Logout successfull" });
};
