const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// SỬA: Import đúng middleware
const { verifyToken, isManager } = require('../middleware/auth.middleware');

// --- PUBLIC ROUTES ---
// 1. Lấy danh sách tất cả sự kiện
// URL: GET http://localhost:3000/api/events
router.get('/', eventController.getAllEvents);

// 2. Lấy chi tiết (Nếu Controller chưa có hàm này thì API sẽ lỗi 500, bạn cần bổ sung sau)
// router.get('/:eventId', eventController.getEventById); 

// --- PROTECTED ROUTES (Cần đăng nhập & Quyền Manager/Admin) ---

// 3. Tạo sự kiện (SỬA: Cần clubId trên URL để biết tạo cho CLB nào)
// URL: POST http://localhost:3000/api/events/clubs/:clubId
router.post('/clubs/:clubId', verifyToken, isManager, eventController.createEvent);

// 4. Cập nhật sự kiện (SỬA: Dùng :eventId thay vì :id)
// URL: PUT http://localhost:3000/api/events/:eventId
router.put('/:eventId', verifyToken, isManager, eventController.updateEvent);

// 5. Xóa sự kiện (SỬA: Dùng :eventId thay vì :id)
// URL: DELETE http://localhost:3000/api/events/:eventId
router.delete('/:eventId', verifyToken, isManager, eventController.deleteEvent);

module.exports = router;