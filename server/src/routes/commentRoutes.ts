import express from "express";
import {
  addComment,
  deleteComment,
  getComment,
  getPostComments,
  updateComment,
  getReplies,
  votes,
} from "../controllers/commentControllers";
import verifyJwt from "../middleware/verifyJwt";
import upload from "../middleware/multerConfig";

const router = express.Router();

// * Dibawah sini adalah routes yang harus login dulu
router.use(verifyJwt);
// * Ilmu baru yaitu optional params dengan ?
router.route("/create/:postId/:parentId?").post(upload.single("image"), addComment);
router.route("/post/:postId").get(getPostComments);
router.get("/replies/:commentId", getReplies);
router.route("/:commentId").get(getComment).patch(updateComment).delete(deleteComment);
router.patch("/vote/:action/:commentId", votes);

export default router;
