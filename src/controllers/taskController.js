const taskService = require('../services/taskService');

/**
 * Create a new task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function createTask(req, res) {
  try {
    const task = await taskService.createTask(req.body, req.user.userId);
    
    return res.status(201).json({
      success: true,
      data: task,
      error: null
    });
    
  } catch (error) {
    console.error('Error creating task:', {
      userId: req.user?.userId,
      error: error.message
    });
    
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
    }
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create task. Please try again later.',
        details: {}
      }
    });
  }
}

/**
 * Get all tasks for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function getTasks(req, res) {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      dueBefore: req.query.dueBefore,
      dueAfter: req.query.dueAfter,
      page: req.query.page,
      pageSize: req.query.pageSize
    };
    
    const result = await taskService.getUserTasks(req.user.userId, filters);
    
    return res.json({
      success: true,
      data: result,
      error: null
    });
    
  } catch (error) {
    console.error('Error fetching tasks:', {
      userId: req.user?.userId,
      error: error.message
    });
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch tasks. Please try again later.',
        details: {}
      }
    });
  }
}

/**
 * Get task by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function getTask(req, res) {
  try {
    const taskId = parseInt(req.params.id);
    const task = await taskService.getTaskById(taskId, req.user.userId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: `Task with ID '${taskId}' does not exist or you don't have access`,
          details: {}
        }
      });
    }
    
    return res.json({
      success: true,
      data: task,
      error: null
    });
    
  } catch (error) {
    console.error('Error fetching task:', {
      taskId: req.params.id,
      userId: req.user?.userId,
      error: error.message
    });
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch task. Please try again later.',
        details: {}
      }
    });
  }
}

/**
 * Update a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function updateTask(req, res) {
  try {
    const taskId = parseInt(req.params.id);
    const task = await taskService.updateTask(taskId, req.user.userId, req.body);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: `Task with ID '${taskId}' does not exist or you don't have access`,
          details: {}
        }
      });
    }
    
    return res.json({
      success: true,
      data: task,
      error: null
    });
    
  } catch (error) {
    console.error('Error updating task:', {
      taskId: req.params.id,
      userId: req.user?.userId,
      error: error.message
    });
    
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
    }
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update task. Please try again later.',
        details: {}
      }
    });
  }
}

/**
 * Delete a task
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function deleteTask(req, res) {
  try {
    const taskId = parseInt(req.params.id);
    const deleted = await taskService.deleteTask(taskId, req.user.userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: `Task with ID '${taskId}' does not exist or you don't have access`,
          details: {}
        }
      });
    }
    
    return res.json({
      success: true,
      data: { message: 'Task deleted successfully' },
      error: null
    });
    
  } catch (error) {
    console.error('Error deleting task:', {
      taskId: req.params.id,
      userId: req.user?.userId,
      error: error.message
    });
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete task. Please try again later.',
        details: {}
      }
    });
  }
}

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
};
