import bcryptjs from "bcryptjs";

const testPassword = async () => {
    const password = "123456"; // Mật khẩu bạn đang nhập
    const hash = "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36kXXT1kKqWyD5tZAF8rjXy"; // Hash từ DB

    const isValid = await bcryptjs.compare(password, hash);
    console.log("Mật khẩu hợp lệ:", isValid); // Kết quả phải là true nếu mật khẩu khớp
};

testPassword();
