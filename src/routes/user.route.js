const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Định nghĩa các đường dẫn
// Chèn 'authMiddleware' vào trước để bảo vệ route

// GET /api/users/profile -> Xem hồ sơ
router.get('/profile', authMiddleware, userController.getProfile);

// PUT /api/users/profile -> Cập nhật hồ sơ
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;