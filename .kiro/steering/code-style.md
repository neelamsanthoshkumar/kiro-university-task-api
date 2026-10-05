---
inclusion: always
---

# Code Style Standards

All code must follow consistent style and coding conventions for maintainability and readability.

## Core Principles

1. **Use async/await instead of callbacks** - Modern, readable asynchronous code
2. **Include JSDoc comments for all functions** - Document purpose, parameters, and return values
3. **Use descriptive variable and function names** - Code should be self-documenting
4. **Follow REST API naming conventions** - Use plural nouns for collections
5. **Use proper HTTP methods** - GET, POST, PUT, DELETE for appropriate operations
6. **Keep functions small and focused** - Single Responsibility Principle

## Async/Await Pattern

### ✅ CORRECT - Use async/await

```javascript
/**
 * Fetch all tasks for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} Array of tasks
 */
async function getUserTasks(userId) {
  try {
    const tasks = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return tasks;
  } catch (error) {
    console.error('Error fetching user tasks:', error.message);
    throw error;
  }
}

/**
 * Create task and send notification
 */
async function createTaskWithNotification(taskData) {
  try {
    // Sequential operations
    const task = await createTask(taskData);
    await sendNotification(task);
    return task;
  } catch (error) {
    console.error('Error creating task with notification:', error.message);
    throw error;
  }
}
```

### ❌ WRONG - Using callbacks (outdated pattern)

```javascript
// AVOID THIS - Use async/await instead
function getUserTasks(userId, callback) {
  db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (error, tasks) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, tasks);
    }
  });
}
```

## JSDoc Comments

All functions must have JSDoc comments documenting their purpose, parameters, and return values.

### ✅ CORRECT - Comprehensive JSDoc

```javascript
/**
 * Create a new task for a user
 * @param {Object} taskData - The task data
 * @param {string} taskData.title - Task title (required)
 * @param {string} taskData.description - Task description (optional)
 * @param {string} taskData.priority - Task priority: low, medium, or high
 * @param {string} taskData.dueDate - Due date in ISO format
 * @param {string} taskData.userId - User ID who owns the task
 * @returns {Promise<Object>} The created task object
 * @throws {Error} If validation fails or database operation fails
 */
async function createTask(taskData) {
  // Implementation
}

/**
 * Validate task data
 * @param {Object} data - Task data to validate
 * @returns {Object|null} Validation errors object or null if valid
 */
function validateTaskData(data) {
  // Implementation
}

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void}
 */
function authenticateToken(req, res, next) {
  // Implementation
}
```

### ❌ WRONG - No documentation

```javascript
// BAD - No documentation
function createTask(taskData) {
  // What does this do? What parameters are required?
  // What does it return? No one knows!
}
```

## Descriptive Naming

Use clear, descriptive names that convey intent.

### ✅ CORRECT - Descriptive names

```javascript
// Variables
const userTasks = await getUserTasks(userId);
const isValidEmail = validateEmail(email);
const hashedPassword = await bcrypt.hash(password, 10);
const authenticatedUser = await authenticateUser(credentials);

// Functions
async function getUserTasksByStatus(userId, status) { }
async function sendTaskDueNotification(taskId) { }
async function updateTaskPriority(taskId, newPriority) { }
function isTaskOverdue(task) { }

// Constants
const MAX_TASK_TITLE_LENGTH = 200;
const DEFAULT_PAGE_SIZE = 20;
const VALID_TASK_PRIORITIES = ['low', 'medium', 'high'];
const VALID_TASK_STATUSES = ['pending', 'in-progress', 'completed'];
```

### ❌ WRONG - Unclear or abbreviated names

```javascript
// BAD - What do these mean?
const data = await get(id);
const x = validate(y);
const pwd = hash(p);

// BAD - Single letter variables (except in loops)
async function f(u, s) { }
function g(t) { }
const a = await auth(c);
```

## REST API Naming Conventions

Follow RESTful conventions for endpoint naming.

### ✅ CORRECT - RESTful endpoints

```javascript
// Collections use plural nouns
app.get('/api/tasks', getTasks);              // Get all tasks
app.post('/api/tasks', createTask);           // Create a task
app.get('/api/tasks/:id', getTask);           // Get specific task
app.put('/api/tasks/:id', updateTask);        // Update specific task
app.delete('/api/tasks/:id', deleteTask);     // Delete specific task

// Nested resources
app.get('/api/users/:userId/tasks', getUserTasks);
app.get('/api/tasks/:taskId/comments', getTaskComments);

// Actions on resources
app.post('/api/tasks/:id/complete', completeTask);
app.post('/api/tasks/:id/archive', archiveTask);

// Filtering and pagination via query parameters
// GET /api/tasks?status=pending&priority=high&page=1&pageSize=20
```

### ❌ WRONG - Non-RESTful endpoints

```javascript
// BAD - Using verbs instead of nouns
app.get('/api/getTasks', getTasks);
app.post('/api/createTask', createTask);
app.post('/api/deleteTask/:id', deleteTask);  // DELETE method, not POST

// BAD - Singular for collections
app.get('/api/task', getTasks);  // Should be /api/tasks

// BAD - Inconsistent naming
app.get('/api/task-list', getTasks);
app.post('/api/new-task', createTask);
```

## HTTP Methods Usage

Use appropriate HTTP methods for operations.

### ✅ CORRECT - Proper HTTP methods

```javascript
// GET - Retrieve data (no side effects)
app.get('/api/tasks', async (req, res) => {
  const tasks = await taskService.findAll();
  return res.json({ success: true, data: tasks, error: null });
});

// POST - Create new resource
app.post('/api/tasks', async (req, res) => {
  const task = await taskService.create(req.body);
  return res.status(201).json({ success: true, data: task, error: null });
});

// PUT - Update entire resource
app.put('/api/tasks/:id', async (req, res) => {
  const task = await taskService.update(req.params.id, req.body);
  return res.json({ success: true, data: task, error: null });
});

// PATCH - Partial update (update specific fields)
app.patch('/api/tasks/:id', async (req, res) => {
  const task = await taskService.partialUpdate(req.params.id, req.body);
  return res.json({ success: true, data: task, error: null });
});

// DELETE - Remove resource
app.delete('/api/tasks/:id', async (req, res) => {
  await taskService.delete(req.params.id);
  return res.json({ success: true, data: null, error: null });
});
```

### ❌ WRONG - Incorrect HTTP methods

```javascript
// BAD - Using POST for everything
app.post('/api/getTasks', getTasks);      // Should be GET
app.post('/api/updateTask', updateTask);  // Should be PUT/PATCH
app.post('/api/deleteTask', deleteTask);  // Should be DELETE
```

## Single Responsibility Principle

Keep functions small and focused on a single task.

### ✅ CORRECT - Single responsibility

```javascript
/**
 * Validate task data
 * @param {Object} data - Task data to validate
 * @returns {Object|null} Validation errors or null
 */
function validateTaskData(data) {
  const errors = {};
  
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  
  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${validPriorities.join(', ')}`;
  }
  
  return Object.keys(errors).length > 0 ? { fields: errors } : null;
}

/**
 * Create a task in database
 * @param {Object} taskData - Validated task data
 * @returns {Promise<Object>} Created task
 */
async function createTaskInDatabase(taskData) {
  const result = await db.query(
    'INSERT INTO tasks (title, description, priority, user_id) VALUES (?, ?, ?, ?)',
    [taskData.title, taskData.description, taskData.priority, taskData.userId]
  );
  return result;
}

/**
 * Send notification for new task
 * @param {Object} task - The task object
 * @returns {Promise<void>}
 */
async function sendTaskCreatedNotification(task) {
  await notificationService.send({
    userId: task.userId,
    message: `Task "${task.title}" created`,
    type: 'task_created'
  });
}

/**
 * Create task handler (orchestrates the above functions)
 */
async function createTaskHandler(req, res) {
  try {
    // Validate
    const validationError = validateTaskData(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid task data', details: validationError }
      });
    }
    
    // Create
    const task = await createTaskInDatabase({ ...req.body, userId: req.user.id });
    
    // Notify (fire and forget)
    sendTaskCreatedNotification(task).catch(err => 
      console.error('Failed to send notification:', err)
    );
    
    return res.status(201).json({ success: true, data: task, error: null });
    
  } catch (error) {
    console.error('Error creating task:', error.message);
    return res.status(500).json({
      success: false,
      data: null,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to create task', details: {} }
    });
  }
}
```

### ❌ WRONG - Function doing too much

```javascript
// BAD - One function doing validation, database operations, and notifications
async function createTask(req, res) {
  // Validation logic mixed in
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title required' });
  }
  
  // Database logic mixed in
  const task = await db.query('INSERT INTO tasks ...', [...]);
  
  // Notification logic mixed in
  await sendEmail(task.userId, 'Task created');
  
  // Response logic mixed in
  return res.json({ task });
}
```

## Code Organization

Organize code into logical modules and layers.

### ✅ CORRECT - Layered architecture

```javascript
// routes/taskRoutes.js - Route definitions
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

router.get('/tasks', authenticateToken, taskController.getTasks);
router.post('/tasks', authenticateToken, taskController.createTask);
router.get('/tasks/:id', authenticateToken, taskController.getTask);
router.put('/tasks/:id', authenticateToken, taskController.updateTask);
router.delete('/tasks/:id', authenticateToken, taskController.deleteTask);

module.exports = router;

// controllers/taskController.js - Request handling
const taskService = require('../services/taskService');

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    return res.status(201).json({ success: true, data: task, error: null });
  } catch (error) {
    // Error handling
  }
};

// services/taskService.js - Business logic
const taskRepository = require('../repositories/taskRepository');

exports.createTask = async (taskData, userId) => {
  // Validation
  // Business logic
  const task = await taskRepository.create({ ...taskData, userId });
  return task;
};

// repositories/taskRepository.js - Data access
const db = require('../config/database');

exports.create = async (taskData) => {
  const result = await db.query('INSERT INTO tasks ...', [...]);
  return result;
};
```

## Consistent Error Handling

All functions should handle errors consistently.

```javascript
/**
 * Get task by ID
 */
async function getTask(req, res) {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id, req.user.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        error: {
          code: 'NOT_FOUND',
          message: `Task with ID '${id}' does not exist`,
          details: {}
        }
      });
    }
    
    return res.json({ success: true, data: task, error: null });
    
  } catch (error) {
    console.error('Error fetching task:', { taskId: req.params.id, error: error.message });
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch task',
        details: {}
      }
    });
  }
}
```

## Code Style Checklist

For every function and endpoint:

- [ ] Use async/await (not callbacks)
- [ ] Include JSDoc comments with parameters and return type
- [ ] Use descriptive variable and function names
- [ ] Follow REST conventions (plural nouns for collections)
- [ ] Use correct HTTP methods (GET, POST, PUT, DELETE)
- [ ] Keep functions small and focused (single responsibility)
- [ ] Organize code into layers (routes, controllers, services, repositories)
- [ ] Handle errors consistently with try-catch
- [ ] Follow the standard API response format
- [ ] Add meaningful comments for complex logic
