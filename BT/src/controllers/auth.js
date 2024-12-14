import bcryptjs from "bcryptjs";
import User from "../model/user.js";
//đăng ký
export const signup = async (req, res) => {
    const { username, password, confirmPassword, email, age } = req.body;

    try {
        if (!/^\d+$/.test(password)) {
            return res.status(400).render("signup", { errors: ["Password chỉ được chứa số"] });
        }

        if (password !== confirmPassword) {
            return res.status(400).render("signup", { errors: ["Password và Confirm Password không khớp"] });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

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
//đăng nhập
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render("signin", { message: "Email không tồn tại" });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).render("signin", { message: "Mật khẩu không chính xác" });
        }

        res.render("welcome", { username: user.username });
    } catch (err) {
        console.error("Lỗi trong quá trình đăng nhập:", err);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};
