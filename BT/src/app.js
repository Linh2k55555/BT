import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import productRouter from "./routers/product.js";
import authRouter from "./routers/auth.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import homeRouter from "./routers/home.js";
import logoutRouter from "./routers/logout.js";
import updateUserRouter from "./routers/updateUser.js"; 
import session from "express-session";
import MongoStore from "connect-mongo"; 
import updateUserRouter from "./routers/auth.js"

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

///view
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cấu hình session
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "defaultSecretKey", // Bí mật cho session
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI, // Kết nối đến MongoDB
        collectionName: "sessions", // Tên collection lưu session
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Cookie sống trong 1 ngày
    },
});
app.use(sessionMiddleware);

connectDB(process.env.DB_URI);

// Các route
app.use("/api", authRouter);
app.use("/api", productRouter);
app.use("/", logoutRouter);
app.use("/user", updateUserRouter);
app.use("/", updateUserRouter);

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

// Khởi chạy server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

export default app;
export const viteNodeApp = app;
