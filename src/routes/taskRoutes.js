const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

// All task routes require authentication
router.use(authenticateToken);

/**
 * @route GET /api/tasks
 * @desc Get all tasks for authenticated user
 * @access Protected
 */
router.get('/', taskController.getTasks);

/**
 * @route POST /api/tasks
 * @desc Create a new task
 * @access Protected
 */
router.post('/', taskController.createTask);

/**
 * @route GET /api/tasks/:id
 * @desc Get task by ID
 * @access Protected
 */
router.get('/:id', taskController.getTask);

/**
 * @route PUT /api/tasks/:id
 * @desc Update a task
 * @access Protected
 */
router.put('/:id', taskController.updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @desc Delete a task
 * @access Protected
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;
