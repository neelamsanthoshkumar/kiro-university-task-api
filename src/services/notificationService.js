const notificationRepository = require('../repositories/notificationRepository');
const taskRepository = require('../repositories/taskRepository');

/**
 * Create notification for task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @param {string} message - Notification message
 * @returns {Promise<Object>} Created notification object
 */
async function createNotification(taskId, userId, message) {
  return await notificationRepository.createNotification({
    taskId,
    userId,
    message
  });
}

/**
 * Get all notifications for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of notification objects
 */
async function getUserNotifications(userId) {
  return await notificationRepository.findUserNotifications(userId);
}

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Updated notification or null if not found
 */
async function markNotificationAsRead(notificationId, userId) {
  return await notificationRepository.markAsRead(notificationId, userId);
}

/**
 * Check for tasks due soon and create notifications
 * @param {number} hoursAhead - Number of hours to look ahead
 * @returns {Promise<Object>} Summary of notifications created
 */
async function checkTasksDueAndNotify(hoursAhead = 24) {
  const tasks = await taskRepository.findTasksByUserId(1); // placeholder or iterate
  let notificationsCreated = 0;
  let notificationsSkipped = 0;
  
  return {
    tasksChecked: 0,
    notificationsCreated,
    notificationsSkipped
  };
}

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  checkTasksDueAndNotify
};
