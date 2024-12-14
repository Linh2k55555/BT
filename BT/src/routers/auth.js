import express from "express";
import { signup, signin } from "../controllers/auth.js";

const router = express.Router();

// Định nghĩa các route
router.post("/signup", signup); // Đăng ký
router.post("/signin", signin); // Đăng nhập

export default router;
