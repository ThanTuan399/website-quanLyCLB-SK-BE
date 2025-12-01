const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Để bảo vệ route
const { verifyToken, isAdmin, isManager } = require('../middleware/auth.middleware');

// Public Routes (Ai cũng xem được)
router.get('/', clubController.getAllClubs);
router.get('/:clubId', clubController.getClubDetail);

// Protected Routes (Phải đăng nhập mới dùng được)
router.post('/:clubId/join', authMiddleware, clubController.joinClub);
router.get('/:clubId/members', authMiddleware, clubController.getMembers);

// Protected Routes (Chỉ Admin mới được làm)
// POST: Tạo mới
router.post('/', verifyToken, isAdmin, clubController.createClub);

// PUT: Cập nhật (theo ID)
router.put('/:id', verifyToken, isAdmin, clubController.updateClub);

// DELETE: Xóa (theo ID)
router.delete('/:id', verifyToken, isAdmin, clubController.deleteClub);

module.exports = router;