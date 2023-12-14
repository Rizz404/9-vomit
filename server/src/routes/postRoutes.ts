import {
  createPost,
  getPost,
  votes,
  getPostsByCategory,
  deletePost,
  searchPostsByTitle,
} from "../controllers/postControllers";
import express from "express";
import upload from "../middleware/multerConfig";
import verifyJwt from "../middleware/verifyJwt";

const router = express.Router();

router.get("/search", searchPostsByTitle);
router.get("/:postId", getPost);

// * Dibawah sini adalah routes yang harus login dulu
router.use(verifyJwt);

// ! masih ada yang req.user nanti perbaiki dulu jadi ga perlu login
// * Jadi userId itu adalah optional, dipakai jika kategorinya adalah user
router.get("/category/:postsCategory/:userId?", getPostsByCategory);
router.post("/create", upload.array("images", 7), createPost);
router.patch("/vote/:action/:postId", votes);
// * Nanti coba satuin params untuk delete, post, sama get one
router.delete("/delete/:postId", deletePost);

export default router;
