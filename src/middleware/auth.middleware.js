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
    // Chúng ta giả định role Chủ nhiệm/BQL sẽ được định nghĩa là 'MANAGER' trong tương lai
    // Hiện tại: chỉ cần là ADMIN là có quyền quản lý
    const userRole = req.user.vaiTro;

    if (userRole === 'ADMIN' || userRole === 'MANAGER') { // CHECK: vaiTro và MANAGER/ADMIN
        next();
    } else {
        res.status(403).json({ message: 'Yêu cầu quyền Chủ nhiệm/BQL' });
    }
};

module.exports = { verifyToken, isAdmin, isManager };