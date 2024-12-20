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
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render("signin", { message: "Email không tồn tại." });
        }

        // So sánh mật khẩu
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).render("signin", { message: "Mật khẩu không chính xác." });
        }

        // Chuyển hướng tới home2 với thông tin người dùng
        res.render("home2", { username: user.username, products: [] });
    } catch (err) {
        console.error("Lỗi trong quá trình đăng nhập:", err);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};

// Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    try {
        // Lấy ID của user từ req.user
        const userId = new mongoose.Types.ObjectId(req.user._id);

        // Kiểm tra nếu mật khẩu và xác nhận mật khẩu không khớp
        if (password !== confirmPassword) {
            return res.status(400).render("update-info", {
                user: req.user,
                errors: ["Mật khẩu và xác nhận mật khẩu không khớp."],
            });
        }

        // Dữ liệu cập nhật
        const updateData = { email }; // Chỉ cập nhật email
        if (password) {
            updateData.password = await bcryptjs.hash(password, 10); // Hash mật khẩu mới
        }

        // Cập nhật thông tin người dùng
        await User.findByIdAndUpdate(userId, updateData);

        // Trả về trang home2.ejs với thông báo thành công
        res.render("home2", {
            username: req.user.username, // Giữ nguyên username
            message: "Thông tin của bạn đã được cập nhật thành công!",
            products: [],
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        res.status(500).render("update-info", {
            user: req.user,
            errors: ["Đã xảy ra lỗi, vui lòng thử lại sau."],
        });
    }
};
export const renderUpdateInfoPage = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ `req.user`
        const user = req.user;

        // Kiểm tra nếu không có thông tin người dùng
        if (!user) {
            return res.status(400).redirect("/signin?message=Vui lòng đăng nhập trước!");
        }

        res.render("update-info", { user, errors: [] });
    } catch (error) {
        console.error("Lỗi khi hiển thị trang cập nhật thông tin:", error);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
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


