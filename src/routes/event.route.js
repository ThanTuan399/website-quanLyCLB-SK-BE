// src/routes/event.route.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Import middleware xác thực

// 1. Lấy danh sách tất cả sự kiện (Public - Không cần đăng nhập)
// Đường dẫn đầy đủ: GET http://localhost:3000/api/events
router.get('/', eventController.getAllEvents);

// Lấy chi tiết 1 sự kiện (Nếu bạn có làm hàm getEventDetail)
router.get('/:id', eventController.getEventDetail);

// --- PROTECTED ROUTES (Cần đăng nhập & Quyền Manager/Admin) ---

// 1. Tạo sự kiện
router.post('/', verifyToken, isManager, eventController.createEvent);

// 2. Cập nhật sự kiện (Mới)
router.put('/:id', verifyToken, isManager, eventController.updateEvent);

// 3. Xóa sự kiện (Mới)
router.delete('/:id', verifyToken, isManager, eventController.deleteEvent);

module.exports = router;