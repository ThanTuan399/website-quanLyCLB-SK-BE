// src/routes/event.route.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Import middleware xác thực

// 1. Lấy danh sách tất cả sự kiện (Public - Không cần đăng nhập)
// Đường dẫn đầy đủ: GET http://localhost:3000/api/events
router.get('/', eventController.getAllEvents);

// 2. Tạo sự kiện mới (Private - Cần Token)
// Đường dẫn đầy đủ: POST http://localhost:3000/api/events/clubs/:clubId
// :clubId là tham số động, ví dụ: /api/events/clubs/1 (tạo cho CLB có ID là 1)
router.post('/clubs/:clubId', authMiddleware, eventController.createEvent);

module.exports = router;