import bcryptjs from "bcryptjs";
import User from "../model/user.js";
import mongoose from "mongoose";

// Đăng ký
export const signup = async (req, res) => {
    const { username, password, confirmPassword, email, age } = req.body;

    try {
        // Kiểm tra mật khẩu chỉ chứa số
        if (!/^[a-zA-Z0-9]+$/.test(password)) {
            return res.status(400).render("signup", { errors: ["Mật khẩu chỉ được chứa chữ và số."] });
        }

        if (password !== confirmPassword) {
            return res.status(400).render("signup", { errors: ["Mật khẩu và Xác nhận mật khẩu không khớp."] });
        }

        // Hash mật khẩu
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Tạo người dùng mới
        await User.create({
            username,
            email,
            password: hashedPassword,
            age,
        });

        res.redirect("/signin?message=Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (err) {
        console.error("Lỗi trong quá trình đăng ký:", err);
        res.status(500).render("signup", { errors: ["Đã xảy ra lỗi, vui lòng thử lại sau."] });
    }
};

// Đăng nhập
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render("signin", { message: "Email không tồn tại." });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).render("signin", { message: "Mật khẩu không chính xác." });
        }

        // Lưu userId vào session
        req.session.userId = user._id;

        res.render("home2", { username: user.username, products: [] });
    } catch (err) {
        console.error("Lỗi trong quá trình đăng nhập:", err);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};

// Thay đổi mật khẩu
export const updatePassword = async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (!req.user) {
        return res.status(401).send("Bạn chưa đăng nhập.");
    }

    if (password !== confirmPassword) {
        return res.status(400).render("update-info", {
            user: req.user,
            errors: ["Mật khẩu và xác nhận mật khẩu không khớp."],
        });
    }

    try {
        const hashedPassword = await bcryptjs.hash(password, 10);

        await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

        res.render("home2", {
            username: req.user.username,
            message: "Mật khẩu của bạn đã được thay đổi thành công!",
            products: [],
        });
    } catch (error) {
        console.error("Lỗi khi thay đổi mật khẩu:", error);
        res.status(500).render("update-info", {
            user: req.user,
            errors: ["Đã xảy ra lỗi, vui lòng thử lại sau."],
        });
    }
};

// Đăng xuất
export const logout = (req, res) => {
    try {
        req.user = null; 

        // Chuyển hướng về trang home1.ejs
        res.render("home1", { message: "Bạn đã đăng xuất thành công!", products: [] }); 
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};


