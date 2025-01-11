import nodemailer from 'nodemailer';

// Hiển thị trang thanh toán cho khách chưa đăng nhập
export const renderCheckoutGuest = (req, res) => {
    const cart = req.session.cart || { items: [] };
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.render('checkoutGuest', {
        cart,
        total,
        message: '',
        errors: [],
    });
};

// Xử lý thanh toán
export const handleGuestCheckout = async (req, res) => {
    const { email, fullName, address, phoneNumber, paymentMethod } = req.body;
    const cart = req.session.cart;

    if (!email || !fullName || !address || !phoneNumber || !paymentMethod || !cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin và đảm bảo giỏ hàng không rỗng!' });
    }

    try {
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                ${cart.items.map(item => `- ${item.name}: ${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} x ${item.quantity}`).join('\n')}
            `,
        };

        await transporter.sendMail(mailOptions);

        console.log(`Đặt hàng thành công cho ${fullName} (${email}). Tổng tiền: ${total}`);

        // Xóa giỏ hàng
        req.session.cart = null;

        // Trả về phản hồi JSON thay vì redirect phía server
        return res.status(200).json({ message: 'Đặt hàng thành công! Kiểm tra email để biết thêm chi tiết.' });
    } catch (error) {
        console.error('Lỗi khi gửi email:', error.message);
        return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau!' });
    }
};
