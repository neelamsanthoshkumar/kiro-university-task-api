const taskRepository = require('../repositories/taskRepository');
const { validateTaskData, isValidStatusTransition } = require('../utils/validation');
const { sanitizeTaskData } = require('../utils/sanitization');

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @param {number} userId - User ID
 * @returns {Object} Created task object
 * @throws {Error} If validation fails
 */
async function createTask(taskData, userId) {
  // Sanitize input
  const sanitized = sanitizeTaskData(taskData);
  
  // Validate input
  const validationError = validateTaskData(sanitized);
  if (validationError) {
    const error = new Error('Invalid task data provided');
    error.code = 'VALIDATION_ERROR';
    error.details = validationError;
    throw error;
  }
  
  // Create task
  const task = await taskRepository.createTask({
    ...sanitized,
    userId,
    status: 'pending'
  });
  
  return task;
}

/**
 * Get all tasks for a user
 * @param {number} userId - User ID
 * @param {Object} filters - Filter and pagination options
 * @returns {Promise<Object>} Tasks with pagination metadata
 */
async function getUserTasks(userId, filters = {}) {
  
  const tasks = await taskRepository.findTasksByUserId(userId);
  
  return {
    tasks,
    pagination: {
      total: tasks.length,
      page: 1,
      pageSize: tasks.length,
      totalPages: 1
    }
  };
}

/**
 * Get task by ID
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Task object or null if not found
 */
async function getTaskById(taskId, userId) {
  return await taskRepository.findTaskById(taskId, userId);
}

/**
 * Update a task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @param {Object} updates - Task updates
 * @returns {Object|null} Updated task object or null if not found
 * @throws {Error} If validation fails
 */
async function updateTask(taskId, userId, updates) {
  // Get current task
  const currentTask = await taskRepository.findTaskById(taskId, userId);
  
  if (!currentTask) {
    return null;
  }
  
  // Sanitize input
  const sanitized = sanitizeTaskData(updates);
  
  // Validate input
  const validationError = validateTaskData({ ...currentTask, ...sanitized });
  if (validationError) {
    const error = new Error('Invalid task data provided');
    error.code = 'VALIDATION_ERROR';
    error.details = validationError;
    throw error;
  }
  
  // Validate status transition if status is being updated
  if (sanitized.status && sanitized.status !== currentTask.status) {
    if (!isValidStatusTransition(currentTask.status, sanitized.status)) {
      const error = new Error(`Invalid status transition from ${currentTask.status} to ${sanitized.status}`);
      error.code = 'VALIDATION_ERROR';
      error.details = {
        fields: {
          status: `Cannot transition from ${currentTask.status} to ${sanitized.status}. Valid transitions: pending → in-progress → completed`
        }
      };
      throw error;
    }
  }
  
  // Update task
  return await taskRepository.updateTask(taskId, userId, sanitized);
}

/**
 * Delete a task
 * @param {number} taskId - Task ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteTask(taskId, userId) {
  return await taskRepository.deleteTask(taskId, userId);
}

module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask
};
