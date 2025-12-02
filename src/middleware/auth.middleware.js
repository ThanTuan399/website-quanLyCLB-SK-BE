// src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

// LƯU Ý: Phải cài đặt thư viện dotenv và file .env có JWT_SECRET
const SECRET = process.env.JWT_SECRET || 'YOUR_SECRET_KEY'; // Dùng giá trị mặc định nếu quên .env

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Bạn chưa đăng nhập! (Thiếu Token)' });

    try {
        // Sử dụng khóa bí mật
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

// 1. Kiểm tra Admin (dùng vaiTro chữ hoa)
const isAdmin = (req, res, next) => {
    if (req.user && req.user.vaiTro === 'ADMIN') { // CHECK: vaiTro và ADMIN
        next();
    } else {
        res.status(403).json({ message: 'Yêu cầu quyền Admin' });
    }
};

// 2. Kiểm tra Chủ nhiệm (Bao gồm cả Admin)
const isManager = (req, res, next) => {
    // Lấy thông tin từ Token đã decode
    const { vaiTro, isManager } = req.user;

    // Cho phép nếu là ADMIN hệ thống HOẶC là Quản lý CLB
    if (vaiTro === 'ADMIN' || isManager === true) {
        next();
    } else {
        res.status(403).json({ message: 'Yêu cầu quyền Chủ nhiệm/BQL' });
    }
};

module.exports = { verifyToken, isAdmin, isManager };