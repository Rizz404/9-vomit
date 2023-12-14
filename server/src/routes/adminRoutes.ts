import verifyJwt from "../middleware/verifyJwt";
import { changeRole, getUsers } from "../controllers/admin/adminControllers";
import express from "express";

const router = express.Router();

// * Dibawah sini adalah routes yang harus login dulu
router.use(verifyJwt);
router.get("/user", verifyJwt, getUsers);
router.patch("/user/:userId", changeRole);

export default router;
