import bcryptjs from "bcryptjs";

const hashPassword = async () => {
    const password = "123456"; // Mật khẩu bạn muốn hash
    const hashedPassword = await bcryptjs.hash(password, 10); // Tạo hash mới
    console.log("Hashed Password:", hashedPassword);
};

hashPassword();
