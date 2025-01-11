import Product from "../model/product.js";
import Cart from '../model/cart.js';
import nodemailer from 'nodemailer';

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
        res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.9");
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


//thanh toán
export const renderCheckoutPage = async (req, res) => {
    const user = req.user || {};
    const { userId } = req.session;

    let total = 0;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (cart) {
            total = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
        }
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
    }

    res.render('checkout', {
        user,
        total, // Tổng thanh toán
        errors: [], // Danh sách lỗi
        message: "", // Thông báo
    });
};

export const handleCheckout = async (req, res) => {
    console.log("Dữ liệu từ form:", req.body); // Kiểm tra dữ liệu từ form
    const { fullName, phoneNumber, address, ward, district, city, paymentMethod } = req.body;
    const { userId } = req.session;

    // Kiểm tra thông tin đầu vào
    if (!fullName || !phoneNumber || !address || !ward || !district || !city || !paymentMethod) {
        return res.status(400).render('checkout', {
            errors: ["Vui lòng điền đầy đủ thông tin và chọn phương thức thanh toán."],
            user: req.user || {},
            total: 0, // Tổng thanh toán mặc định là 0 nếu có lỗi
        });
    }

    try {
        // Lấy giỏ hàng của người dùng
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).render('checkout', {
                errors: ["Giỏ hàng trống. Không thể thanh toán."],
                user: req.user || {},
                total: 0,
            });
        }

        // Tính tổng tiền
        const total = cart.items.reduce(
            (sum, item) => sum + item.productId.price * item.quantity,
            0
        );

        console.log("Tổng tiền thanh toán:", total);

        // Lấy email từ người dùng
        const email = req.user?.email || ''; // Đảm bảo email tồn tại
        if (!email) {
            return res.status(400).render('checkout', {
                errors: ["Không tìm thấy email người dùng."],
                user: req.user || {},
                total,
            });
        }

        // Thời gian đặt hàng
        const now = new Date();
        const formattedDate = now.toLocaleString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        console.log("Ngày giờ đặt hàng:", formattedDate);

        // Gửi email xác nhận
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Xác nhận đơn hàng',
            text: `Cảm ơn bạn, ${fullName}, đã đặt hàng.
Tổng đơn hàng: ${total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}.
Địa chỉ giao hàng: ${address}, ${ward}, ${district}, ${city}.
Số điện thoại: ${phoneNumber}.
Phương thức thanh toán: ${paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}.
Ngày đặt hàng: ${formattedDate}.
            `,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);
        console.log("Email xác nhận đã được gửi.");

        // Xóa giỏ hàng sau khi thanh toán thành công
        await Cart.deleteOne({ userId });
        console.log("Giỏ hàng đã được xóa.");

        // Chuyển hướng về trang home2 với thông báo thành công
        res.redirect('/home2?message=Đặt hàng thành công! Kiểm tra email để biết thêm chi tiết.');
    } catch (error) {
        console.error("Lỗi khi xử lý thanh toán:", error);
        res.status(500).render('checkout', {
            errors: ["Đã xảy ra lỗi, vui lòng thử lại sau."],
            user: req.user || {},
            total: 0,
        });
    }
};
