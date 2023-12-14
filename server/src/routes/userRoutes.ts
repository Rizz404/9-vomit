import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserFriends,
  getUser,
  searchUserByQuery,
  searchAllUserByQuery,
  followOrUnfollowAndUpdateFollowers,
  searchPasswordAndCompare,
} from "../controllers/userControllers";
import upload from "../middleware/multerConfig";
import verifyJwt from "../middleware/verifyJwt";

const router = express.Router();

router.get("/user/:userId", getUser);
router.get("/search-user", searchUserByQuery);
router.get("/search-all-user", searchAllUserByQuery);

// * Dibawah sini adalah routes yang harus login dulu
router.use(verifyJwt);
router.route("/profile").get(getUserProfile).patch(upload.single("profilePict"), updateUserProfile);
router.route("/friends").get(getUserFriends);
router.patch("/follow/:friendId", followOrUnfollowAndUpdateFollowers);
router.get("/compare-password", searchPasswordAndCompare);

export default router;
