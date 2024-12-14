import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import productRouter from "./routers/product.js";
import authRouter from "./routers/auth.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

connectDB(process.env.DB_URI);

app.use("/api", authRouter);
app.use("/api", productRouter);

app.get("/signup", (req, res) => {
    res.render("signup", { errors: [] });
});

app.get("/signin", (req, res) => {
    const message = req.query.message || "";
    res.render("signin", { message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

export default app;
export const viteNodeApp = app;