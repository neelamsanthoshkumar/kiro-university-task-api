const notificationService = require('../services/notificationService');

/**
 * Get all notifications for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function getNotifications(req, res) {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.userId);
    
    return res.json({
      success: true,
      data: { notifications },
      error: null
    });
    
  } catch (error) {
    console.error('Error fetching notifications:', {
      userId: req.user?.userId,
      error: error.message
    });
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch notifications. Please try again later.',
        details: {}
      }
    });
  }
}

/**
 * Mark notification as read
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function markAsRead(req, res) {
  try {
    const notificationId = parseInt(req.params.id);
    const notification = await notificationService.markNotificationAsRead(notificationId, req.user.userId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: `Notification with ID '${notificationId}' does not exist or you don't have access`,
          details: {}
        }
      });
    }
    
    return res.json({
      success: true,
      data: notification,
      error: null
    });
    
  } catch (error) {
    console.error('Error marking notification as read:', {
      notificationId: req.params.id,
      userId: req.user?.userId,
      error: error.message
    });
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update notification. Please try again later.',
        details: {}
      }
    });
  }
}

module.exports = {
  getNotifications,
  markAsRead
};
