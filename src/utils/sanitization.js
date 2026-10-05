/**
 * Sanitize string input by removing dangerous characters
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  
  // Remove HTML tags and dangerous characters
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .substring(0, 1000); // Limit length
}

/**
 * Sanitize task data
 * @param {Object} taskData - Task data to sanitize
 * @returns {Object} Sanitized task data
 */
function sanitizeTaskData(taskData) {
  const sanitized = {};
  
  if (taskData.title) {
    sanitized.title = sanitizeString(taskData.title).substring(0, 200);
  }
  
  if (taskData.description) {
    sanitized.description = sanitizeString(taskData.description);
  }
  
  if (taskData.priority) {
    sanitized.priority = taskData.priority.toLowerCase();
  }
  
  if (taskData.status) {
    sanitized.status = taskData.status.toLowerCase();
  }
  
  if (taskData.dueDate) {
    sanitized.dueDate = taskData.dueDate;
  }
  
  if (taskData.tags && Array.isArray(taskData.tags)) {
    sanitized.tags = taskData.tags.map(tag => sanitizeString(tag)).filter(tag => tag.length > 0);
  }
  
  return sanitized;
}

/**
 * Sanitize user data
 * @param {Object} userData - User data to sanitize
 * @returns {Object} Sanitized user data
 */
function sanitizeUserData(userData) {
  const sanitized = {};
  
  if (userData.email) {
    sanitized.email = userData.email.trim().toLowerCase();
  }
  
  if (userData.name) {
    sanitized.name = sanitizeString(userData.name).substring(0, 100);
  }
  
  // Never sanitize password - it should be hashed as-is
  if (userData.password) {
    sanitized.password = userData.password;
  }
  
  return sanitized;
}

module.exports = {
  sanitizeString,
  sanitizeTaskData,
  sanitizeUserData
};
