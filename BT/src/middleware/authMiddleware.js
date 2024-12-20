import User from "../model/user.js";

export const isAuthenticated = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send("Bạn chưa đăng nhập.");
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).send("Không tìm thấy thông tin người dùng.");
        }

        req.user = user; // Gắn user vào request
        next();
    } catch (error) {
        console.error("Lỗi trong middleware isAuthenticated:", error);
        res.status(500).send("Đã xảy ra lỗi.");
    }
};
