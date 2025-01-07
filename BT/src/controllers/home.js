import Product from "../model/product.js";
import Cart from '../model/cart.js';

export const renderHomePage = async (req, res) => {
    try {
        // Lấy danh sách sản phẩm từ MongoDB
        const products = await Product.find();

        res.render("home1", {
            products, // Truyền danh sách sản phẩm
            message: req.query.message || "", // Thông báo sau khi đăng xuất
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Lỗi hệ thống, vui lòng thử lại sau.");
    }
};


export const renderHome2 = async (req, res) => {
    try {
        const userId = req.session.userId; // Lấy userId từ session
        const username = req.query.username || req.user?.username || "Người dùng";

        // Lấy danh sách sản phẩm
        const products = await Product.find();

        // Lấy giỏ hàng của người dùng
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        res.render('home2', {
            username,
            products,
            cart: cart || { items: [] }, // Nếu không có giỏ hàng, truyền giỏ hàng rỗng
            message: req.query.message || "",
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
};




export const renderUpdateInfo = (req, res) => {
    const user = {
        username: "",
        email: "",
        age: 25
    }; // Thay thế bằng dữ liệu thực tế từ DB
    res.render("update-info", { user, errors: [] });
};
