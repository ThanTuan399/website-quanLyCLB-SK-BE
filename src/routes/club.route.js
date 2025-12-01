const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Để bảo vệ route

// Public Routes (Ai cũng xem được)
router.get('/', clubController.getAllClubs);
router.get('/:clubId', clubController.getClubDetail);

// Protected Routes (Phải đăng nhập mới dùng được)
router.post('/:clubId/join', authMiddleware, clubController.joinClub);
router.get('/:clubId/members', authMiddleware, clubController.getMembers);

module.exports = router;