import express from "express";
import { renderUpdateUserPage, updateUser } from "../controllers/updateUser.js";

const router = express.Router();

router.get("/update-user", renderUpdateUserPage); // Hiển thị form cập nhật
router.post("/update-user", updateUser); // Xử lý cập nhật mật khẩu

export default router;
