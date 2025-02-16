import express from "express";
import { signup, signin, logout, updatePassword } from "../user/controller.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup); // Đăng ký
router.post("/signin", signin); // Đăng nhập
router.post("/update-password", isAuthenticated, updatePassword); // Chỉ cho phép người đã đăng nhập thay đổi mật khẩu
router.get("/logout", logout); // Đăng xuất

export default router;
