const express = require('express');
const router = express.Router();
const regController = require('../controllers/registration.controller');
const authMiddleware = require('../middleware/auth.middleware');
const reportController = require('../controllers/report.controller');

// Tất cả các route này đều cần đăng nhập
router.use(authMiddleware);

// Sinh viên đăng ký
router.post('/register', regController.registerEvent);

// Sinh viên lấy mã QR vé của mình
router.get('/ticket/:eventId', regController.getMyTicketQR);

// BQL điểm danh (Quét mã)
// (Thực tế nên có thêm middleware kiểm tra quyền Manager, nhưng tạm thời dùng Auth thường để test)
router.post('/check-in', regController.checkInUser);

// --- API BÁO CÁO ---
// Xem thống kê sự kiện (Dành cho BQL)
// GET http://localhost:3000/api/registrations/reports/:eventId
router.get('/reports/:eventId', reportController.getEventStats);

module.exports = router;