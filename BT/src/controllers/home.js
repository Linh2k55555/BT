import Product from "../model/product.js";

export const renderHomePage = async (req, res) => {
    try {
        const products = await Product.find(); // Lấy danh sách sản phẩm từ cơ sở dữ liệu
        res.render("home1", {
            products, // Danh sách sản phẩm
            message: req.query.message || "", // Thêm thông báo nếu có
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Lỗi hệ thống, vui lòng thử lại sau.");
    }
};


export const renderHome2 = async (req, res) => {
    try {
        // Lấy danh sách sản phẩm từ cơ sở dữ liệu
        const products = await Product.find();

        // Kiểm tra nếu không có user
        const username = req.user?.username || "Người dùng";

        // Truyền danh sách sản phẩm vào EJS
        res.render("home2", {
            username, // Tên người dùng
            products, // Danh sách sản phẩm
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
