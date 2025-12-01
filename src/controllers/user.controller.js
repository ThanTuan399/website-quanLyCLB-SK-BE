const User = require('../models/user.model');

// 1. Xem hồ sơ cá nhân
exports.getProfile = async (req, res) => {
  try {
    // req.user được lấy từ authMiddleware
    const userId = req.user.userId; 

    // Tìm user theo ID, NHƯNG loại bỏ trường mật khẩu (attributes: { exclude: ... })
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['matKhau'] }
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// 2. Cập nhật hồ sơ
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hoTen, mssv, avatarUrl } = req.body; // Chỉ cho phép sửa những thông tin này

    // Tìm user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // Cập nhật thông tin
    // Nếu người dùng không gửi trường nào thì giữ nguyên trường cũ
    user.hoTen = hoTen || user.hoTen;
    user.mssv = mssv || user.mssv;
    user.avatarUrl = avatarUrl || user.avatarUrl;

    await user.save(); // Lưu vào CSDL

    res.json({ message: "Cập nhật hồ sơ thành công!", user });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};