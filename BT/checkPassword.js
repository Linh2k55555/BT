import bcryptjs from "bcryptjs";

const testPassword = async () => {
    const password = "111111"; // Mật khẩu bạn đang nhập
    const hash = "$2a$10$uCxytt5OZ2w0XVSL0m9Jou5LICbekUorGxbl8j9xwVz9iqsHSTKPy"; // Hash từ DB

    const isValid = await bcryptjs.compare(password, hash);
    console.log("Mật khẩu hợp lệ:", isValid); // Kết quả phải là true nếu mật khẩu khớp
};

testPassword();
