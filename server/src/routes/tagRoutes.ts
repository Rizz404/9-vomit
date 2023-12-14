import { getPostsByTag, searchTagsByName, getTags, getTag } from "../controllers/tagControllers";
import express from "express";

const router = express.Router();

router.get("/category/:category?", getTags);
router.get("/tag/:tagId", getTag);
router.get("/search", searchTagsByName);
router.get("/posts/:name", getPostsByTag);

export default router;
