const { getDatabase } = require('../config/database');

/**
 * Create a new notification
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Created notification object
 */
async function createNotification(notificationData) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO notifications (user_id, task_id, message) VALUES (?, ?, ?)`,
      [notificationData.userId, notificationData.taskId, notificationData.message],
      async function(err) {
        if (err) {
          reject(err);
        } else {
          try {
            const notification = await findNotificationById(this.lastID, notificationData.userId);
            resolve(notification);
          } catch (e) {
            reject(e);
          }
        }
      }
    );
  });
}

/**
 * Find notification by ID and user ID
 * @param {number} notificationId - Notification ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Notification object or null if not found
 */
async function findNotificationById(notificationId, userId) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, user_id, task_id, message, is_read, created_at FROM notifications WHERE id = ? AND user_id = ?`,
      [notificationId, userId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      }
    );
  });
}

/**
 * Find all notifications for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of notification objects
 */
async function findUserNotifications(userId) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT n.id, n.user_id, n.task_id, n.message, n.is_read, n.created_at,
              t.title as task_title, t.due_date as task_due_date
       FROM notifications n
       LEFT JOIN tasks t ON n.task_id = t.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      }
    );
  });
}

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Updated notification or null if not found
 */
async function markAsRead(notificationId, userId) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
      [notificationId, userId],
      async function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null);
        } else {
          try {
            const notification = await findNotificationById(notificationId, userId);
            resolve(notification);
          } catch (e) {
            reject(e);
          }
        }
      }
    );
  });
}

/**
 * Check if notification exists for task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if notification exists
 */
async function notificationExistsForTask(taskId, userId) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) as count FROM notifications WHERE task_id = ? AND user_id = ?`,
      [taskId, userId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.count > 0 : false);
        }
      }
    );
  });
}

module.exports = {
  createNotification,
  findNotificationById,
  findUserNotifications,
  markAsRead,
  notificationExistsForTask
};
