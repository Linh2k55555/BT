import express from "express";
import { renderUpdateInfoPage, updateUser } from "../controllers/auth.js";

const router = express.Router();

// Route hiển thị trang cập nhật thông tin
router.get("/update-info", renderUpdateInfoPage);

// Route xử lý cập nhật thông tin
router.post("/update-info", updateUser);

export default router;
