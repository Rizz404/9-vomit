import express from "express";
import { register, login, logout } from "../controllers/auth/jwtAuth";
import { googleLogin } from "../controllers/auth/firebaseAuth";

const router = express.Router();

router.post("/google-login", googleLogin);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
