import express from "express";
import { signup, signin, updateUser, logout, renderUpdateInfoPage } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);       // Đăng ký
router.post("/signin", signin);       // Đăng nhập
router.get("/update-info", renderUpdateInfoPage); // Hiển thị form cập nhật thông tin
router.post("/update-info", updateUser); // Đổi thông tin
router.get("/logout", logout);        // Đăng xuất

export default router;
    