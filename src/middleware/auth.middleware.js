const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Lấy token từ header
  // Client sẽ gửi dạng: "Bearer <token_cua_ban>"
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập! (Thiếu Token)" });
  }

  try {
    // 2. Kiểm tra (Verify) token
    // LƯU Ý: 'YOUR_SECRET_KEY' phải khớp Y HỆT với file auth.controller.js
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');

    // 3. Lưu thông tin user đã giải mã vào request để dùng sau này
    req.user = decoded; 
    
    // 4. Cho phép đi tiếp
    next();

  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

module.exports = authMiddleware;