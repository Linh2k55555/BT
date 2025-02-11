import nodemailer from 'nodemailer';

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (req, res) => {
    const { productId, price, name } = req.body;

    if (!req.session.cart) {
        req.session.cart = { items: [] }; // Tạo giỏ hàng
    }

    const existingItem = req.session.cart.items.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        req.session.cart.items.push({ productId, name, price, quantity: 1 });
    }

    res.status(200).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công', cart: req.session.cart });
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = (req, res) => {
    const { productId } = req.body;

    if (!req.session.cart) {
        return res.status(400).json({ message: 'Giỏ hàng trống!' });
    }

    req.session.cart.items = req.session.cart.items.filter(item => item.productId !== productId);

    res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng!' });
};
// Thanh toán giỏ hàng
export const checkout = async (req, res) => {
    const { email, fullName, address, phoneNumber, paymentMethod } = req.body;

    if (!req.session.cart || req.session.cart.items.length === 0) {
        return res.status(400).json({ message: 'Giỏ hàng trống! Vui lòng thêm sản phẩm.' });
    }

    const total = req.session.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
        // Cấu hình email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const orderDate = new Date().toLocaleString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Xác nhận đơn hàng của bạn',
            text: `
                Cảm ơn bạn đã đặt hàng, ${fullName}!
                Địa chỉ giao hàng: ${address}
                Số điện thoại: ${phoneNumber}
                Ngày giờ đặt hàng: ${orderDate}
                Tổng tiền: ${total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                Phương thức thanh toán: ${paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
                Chi tiết đơn hàng:
                ${req.session.cart.items.map(item => `- ${item.name}: ${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} x ${item.quantity}`).join('\n')}
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Đặt hàng thành công cho ${fullName} (${email}). Tổng tiền: ${total}`);

        req.session.cart = null;

        // Trả về phản hồi JSON
        return res.status(200).json({
            message: 'Đặt hàng thành công! Kiểm tra email để biết thêm chi tiết.',
            redirect: '/' // URL để frontend chuyển hướng
        });
    } catch (error) {
        console.error('Lỗi khi gửi email:', error.message);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình thanh toán hoặc gửi email.' });
    }
};
