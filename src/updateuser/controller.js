import User from "../user/model";
import bcryptjs from "bcryptjs";

// Hiển thị trang đổi thông tin người dùng
export const renderUpdateUserPage = async (req, res) => {
    try {
      // Kiểm tra xem người dùng đã đăng nhập hay chưa
      if (!req.session.userId) {
        return res.redirect("/signin");
      }
  
      // Lấy thông tin người dùng từ cơ sở dữ liệu
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(404).send("Không tìm thấy thông tin người dùng.");
      }
  
      // Render trang cập nhật với thông tin người dùng
      res.render("update-user", {
        user, // Truyền thông tin người dùng vào view
        errors: [],
      });
    } catch (error) {
      console.error("Lỗi khi hiển thị trang cập nhật thông tin:", error);
      res.status(500).send("Đã xảy ra lỗi, vui lòng thử lại sau.5");
    }
  };
  
  // Cập nhật thông tin người dùng
  export const updateUser = async (req, res) => {
    const { username, age } = req.body;
  
    try {
      // Kiểm tra nếu không có thông tin người dùng trong session
      if (!req.session || !req.session.userId) {
        return res.status(401).send("Bạn chưa đăng nhập.");
      }
  
      // Cập nhật thông tin người dùng trong MongoDB
      const updatedUser = await User.findByIdAndUpdate(
        req.session.userId,
        { username, age },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).send("Không tìm thấy người dùng.");
      }
  
      // Cập nhật lại session với thông tin mới
      req.session.username = updatedUser.username;
      req.session.age = updatedUser.age;
  
      // Quay lại trang home2 với thông báo
      res.redirect("/home2?message=Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      res.status(500).render("update-user", {
        user: req.session,
        errors: ["Đã xảy ra lỗi, vui lòng thử lại sau.6"],
      });
    }
  };
  