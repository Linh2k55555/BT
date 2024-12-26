import bcryptjs from "bcryptjs";
import User from "../model/user.js";
import Product from "../model/product.js";


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

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).render("signin", { message: "Mật khẩu không chính xác." });
        }

        // Lấy thông tin người dùng
        const username = user.username;
        // Render trang home2 với thông tin người dùng
        res.render("home2", {
            username,
            products: await Product.find(), // Lấy danh sách sản phẩm
            message: req.query.message || "", // Truyền thông báo nếu có
        });
    } catch (err) {
        console.error("Lỗi trong quá trình đăng nhập:", err);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};



// Thay đổi mật khẩu
export const updatePassword = async (req, res) => {
    const { oldPassword, password, confirmPassword } = req.body;

    if (!req.user) {
        return res.status(401).send("Bạn chưa đăng nhập.");
    }

    if (password !== confirmPassword) {
        return res.status(400).render("update-info", {
            errors: ["Mật khẩu mới và xác nhận mật khẩu không khớp."],
            user: req.user, // Truyền thông tin người dùng để giữ dữ liệu trong form
        });
    }

    try {
        const user = await User.findById(req.user._id);

        // Kiểm tra mật khẩu cũ
        const isOldPasswordValid = await bcryptjs.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).render("update-info", {
                errors: ["Mật khẩu cũ không chính xác."],
                user: req.user,
            });
        }

        // Hash mật khẩu mới
        const hashedPassword = await bcryptjs.hash(password, 10);
        await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

        // Chuyển hướng về trang home2 với thông báo
        res.redirect(`/home2?message=Cập nhật mật khẩu thành công!`);
    } catch (error) {
        console.error("Lỗi khi thay đổi mật khẩu:", error);
        res.status(500).render("update-info", {
            errors: ["Đã xảy ra lỗi, vui lòng thử lại sau."],
            user: req.user,
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


export const renderUpdateUserPage = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id); // Lấy thông tin user từ session
        res.render("update-user", { user, errors: [] });
    } catch (error) {
        console.error("Lỗi khi hiển thị trang cập nhật thông tin:", error);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};

// Hiển thị trang đổi thông tin người dùng
export const renderUpdateInfo = async (req, res) => {
    try {
        // Kiểm tra nếu không có thông tin người dùng trong session
        if (!req.session || !req.session.user) {
            return res.status(401).send("Bạn chưa đăng nhập.");
        }

        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await User.findById(req.session.user._id);

        // Kiểm tra nếu không tìm thấy người dùng
        if (!user) {
            return res.status(404).send("Không tìm thấy thông tin người dùng.");
        }

        // Truyền thông tin người dùng vào view
        res.render("update-user", { user, errors: [] });
    } catch (error) {
        console.error("Lỗi khi hiển thị trang đổi thông tin:", error);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};

// Cập nhật thông tin người dùng
export const updateUserInfo = async (req, res) => {
    const { username, age } = req.body;

    try {
        // Cập nhật thông tin người dùng trong cơ sở dữ liệu
        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { username, age },
            { new: true } // Trả về đối tượng người dùng đã cập nhật
        );

        req.session.user.username = updatedUser.username;
        req.session.user.age = updatedUser.age;

        res.render("home2", {
            username: updatedUser.username,
            products: await Product.find(),
            message: "Cập nhật thông tin thành công!",
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin:", error);
        res.status(500).render("update-user", {
            user: req.session.user,
            errors: ["Đã xảy ra lỗi, vui lòng thử lại sau."],
        });
    }
};
