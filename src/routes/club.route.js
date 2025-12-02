const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club.controller');
const authMiddleware = require('../middleware/auth.middleware'); // Để bảo vệ route
const { verifyToken, isAdmin, isManager } = require('../middleware/auth.middleware');
const registrationController = require('../controllers/registration.controller');

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

// Endpoint: PUT /api/clubs/:clubId/members/:userId/status
router.put('/:clubId/members/:userId/status', verifyToken, isManager, clubController.updateMemberStatus);

// Endpoint: PUT /api/registrations/events/:eventId/users/:userId/status
router.put('/events/:eventId/users/:userId/status', verifyToken, isManager, registrationController.updateRegistrationStatus);

module.exports = router;