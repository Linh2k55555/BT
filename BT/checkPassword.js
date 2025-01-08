import bcryptjs from "bcryptjs";

const testPassword = async () => {
    const password = "123456"; // Mật khẩu bạn đang nhập
    const hash = "$2a$10$84BZgUuoRYZXSrSJCMjI0eU.jyvryl8VydhUa98pFdU6id9CQdTKy"; // Hash từ DB

    const isValid = await bcryptjs.compare(password, hash);
    console.log("Mật khẩu hợp lệ:", isValid); // Kết quả phải là true nếu mật khẩu khớp
};

testPassword();
