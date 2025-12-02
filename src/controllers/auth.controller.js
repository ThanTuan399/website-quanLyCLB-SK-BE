// --- File này chứa logic nghiệp vụ chính của việc Đăng ký và Đăng nhập ---

// Import các "phụ tùng" cần thiết
const User = require('../models/user.model'); // Import Model User
const bcrypt = require('bcryptjs'); // Import thư viện mã hóa mật khẩu
const jwt = require('jsonwebtoken'); // Import thư viện tạo Token
const { ClubMember } = require('../models'); // Import thêm ClubMember

// 1. Logic cho chức năng Đăng ký (Register)
exports.register = async (req, res) => {
  try {
    // Lấy thông tin từ "thân" (body) của request mà Postman gửi lên
    const { hoTen, email, matKhau, mssv, vaiTro } = req.body;

    // 1. Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // Nếu email đã có, trả về lỗi 400 (Bad Request)
      return res.status(400).json({ message: "Email đã tồn tại." });
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedMatKhau = await bcrypt.hash(matKhau, salt);

    // 3. Tạo người dùng mới trong CSDL
    const newUser = await User.create({
      hoTen,
      email,
      matKhau: hashedMatKhau, // Lưu mật khẩu đã mã hóa
      mssv,
      vaiTro // Dùng vaiTro được cung cấp, hoặc mặc định (đã set trong Model)
    });

    // 4. Trả về thông báo thành công (201 Created)
    res.status(201).json({ message: "Tạo tài khoản thành công!", userId: newUser.userId });

  } catch (error) {
    // Nếu có lỗi server (ví dụ: lỗi CSDL)
    res.status(500).json({ message: "Lỗi server khi đăng ký", error: error.message });
  }
};


// 2. Logic cho chức năng Đăng nhập (Login)
exports.login = async (req, res) => {
  try {
    const { email, matKhau } = req.body;

    // 1. Tìm người dùng trước (ĐƯA LÊN ĐẦU)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Sai email hoặc mật khẩu." });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(matKhau, user.matKhau);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
    }

    // --- 3. ĐOẠN CODE MỚI (Đặt ở đây mới đúng): Kiểm tra quyền Quản lý ---
    // Lúc này 'user' đã có giá trị
    const isClubManager = await ClubMember.findOne({
      where: { 
        userId: user.userId,
        chucVu: 'quan_ly'
      }
    });

    // 4. Tạo Token
    const payload = {
      userId: user.userId,
      email: user.email,
      vaiTro: user.vaiTro, 
      isManager: !!isClubManager // Chuyển object thành boolean (true/false)
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'YOUR_SECRET_KEY', {
      expiresIn: '2h' 
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
      user: {
        userId: user.userId,
        hoTen: user.hoTen,
        email: user.email,
        mssv: user.mssv,
        vaiTro: user.vaiTro,
        avatarUrl: user.avatarUrl,
        isManager: !!isClubManager // Trả về FE để hiển thị menu phù hợp
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi đăng nhập", error: error.message });
  }
};