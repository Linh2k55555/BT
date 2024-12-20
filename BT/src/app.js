import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import productRouter from "./routers/product.js";
import authRouter from "./routers/auth.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import morgan from "morgan";
import homeRouter from "./routers/home.js";
import fs from "fs";
import logoutRouter from "./routers/logout.js"; 
import updateUserRouter from "./routers/updateUser.js";
import mongoose from "mongoose";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Định tuyến tệp tĩnh
app.use("/src/image", express.static(path.join(__dirname, "image")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.user = {
        _id: new mongoose.Types.ObjectId("64a7f2b9b9f1c9e1e8e8e8e8"), // Thay thế bằng ObjectId thực tế
        username: "DemoUser",
        email: "demo@example.com",
    };
    next();
});
connectDB(process.env.DB_URI);

app.use("/api", authRouter);

app.use("/api", productRouter);

app.use("/", logoutRouter);

app.use("/user", updateUserRouter);
// Đăng ký
app.get("/signup", (req, res) => {
    res.render("signup", { errors: [] });
});

// Đăng nhập
app.get("/signin", (req, res) => {
    const message = req.query.message || "";
    res.render("signin", { message });
});

// Trang home
app.use("/", homeRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});


export default app;
export const viteNodeApp = app;
