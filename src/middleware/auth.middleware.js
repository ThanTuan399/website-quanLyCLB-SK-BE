const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Nếu cần check DB

const authMiddleware = (req, res, next) => 
{
  // 1. Lấy token từ header
  // Client sẽ gửi dạng: "Bearer <token_cua_ban>"
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Thiếu Token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Payload thường chứa { id, role, ... }
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token lỗi' });
    }
};

const isAdmin = (req, res, next) => {
    // Lưu ý: Kiểm tra xem trong token bạn lưu field là 'role' hay 'chucVu'?
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Yêu cầu quyền Admin' });
    }
};

const isManager = (req, res, next) => {
    if (req.user && (req.user.role === 'manager' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Yêu cầu quyền Chủ nhiệm' });
    }
};

module.exports = { verifyToken, isAdmin, isManager };