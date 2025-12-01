// --- File này định nghĩa các đường dẫn (endpoints) cho Module Auth ---

const express = require('express');
const router = express.Router();

// Import file controller (nơi chứa logic)
const authController = require('../controllers/auth.controller');

// Định nghĩa đường dẫn cho Đăng ký
// Khi có yêu cầu POST đến /register, hãy gọi hàm authController.register
router.post('/register', authController.register);

// Định nghĩa đường dẫn cho Đăng nhập
// Khi có yêu cầu POST đến /login, hãy gọi hàm authController.login
router.post('/login', authController.login);

// "Chia sẻ" (export) router này để file index.js có thể dùng
module.exports = router;