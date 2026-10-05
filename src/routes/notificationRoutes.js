const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// All notification routes require authentication
router.use(authenticateToken);

/**
 * @route GET /api/notifications
 * @desc Get all notifications for authenticated user
 * @access Protected
 */
router.get('/', notificationController.getNotifications);

/**
 * @route PATCH /api/notifications/:id/read
 * @desc Mark notification as read
 * @access Protected
 */
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
