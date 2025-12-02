const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club.controller');

// SỬA: Import đúng cú pháp Destructuring (Vì file middleware export object)
const { verifyToken, isAdmin, isManager } = require('../middleware/auth.middleware');

// --- PUBLIC ROUTES (Ai cũng xem được) ---
router.get('/', clubController.getAllClubs);
router.get('/:clubId', clubController.getClubDetail);

// --- MEMBER ROUTES (Phải đăng nhập) ---
router.post('/:clubId/join', verifyToken, clubController.joinClub);
router.get('/:clubId/members', verifyToken, isManager, clubController.getMembers);

// --- ADMIN ROUTES (CRUD CLB - Chỉ Admin) ---
// Tạo mới
router.post('/', verifyToken, isAdmin, clubController.createClub);

// Cập nhật (SỬA: Dùng :clubId thay vì :id để khớp với Controller)
router.put('/:clubId', verifyToken, isAdmin, clubController.updateClub);

// Xóa (SỬA: Dùng :clubId thay vì :id)
router.delete('/:clubId', verifyToken, isAdmin, clubController.deleteClub);

// --- MANAGER ROUTES (Quản lý thành viên) ---
// Duyệt thành viên: PUT /api/clubs/:clubId/members/:userId/status
router.put('/:clubId/members/:userId/status', verifyToken, isManager, clubController.updateMemberStatus);

// LƯU Ý: Đã xóa route 'updateRegistrationStatus' vì nó thuộc về registration.route.js

module.exports = router;