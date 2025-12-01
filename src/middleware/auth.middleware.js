const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => 
{
  // 1. Lấy token từ header
  // Client sẽ gửi dạng: "Bearer <token_cua_ban>"
  const authHeader = req.header('Authorization');
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) 
    {
    return res.status(401).json({ message: "Bạn chưa đăng nhập! (Thiếu Token)" });
    }

  try 
  {
    // 2. Kiểm tra (Verify) token
    // LƯU Ý: 'YOUR_SECRET_KEY' phải khớp Y HỆT với file auth.controller.js
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // 3. Lưu thông tin user đã giải mã vào request để dùng sau này
    req.user = decoded; 
    
    // 4. Cho phép đi tiếp
    next();

  } 
  
  catch (error)
  {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// Middleware kiểm tra quyền ADMIN (Quyền cao nhất)
const isAdmin = (req, res, next) => {
    // Lưu ý: req.user đã được tạo ra từ hàm verifyToken chạy trước đó
    if (req.user && req.user.role === 'admin') {
        next(); // Là Admin -> Cho qua
    } else {
        return res.status(403).json({ message: 'Truy cập bị từ chối! Bạn không phải là Admin.' });
    }
};

// Middleware kiểm tra quyền MANAGER (Chủ nhiệm CLB) hoặc ADMIN
const isManager = (req, res, next) => {
    // Admin cũng có quyền của Manager, nên cho phép cả 2
    if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
        next(); // Là Manager hoặc Admin -> Cho qua
    } else {
        return res.status(403).json({ message: 'Truy cập bị từ chối! Yêu cầu quyền Chủ nhiệm hoặc Admin.' });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    isManager
};