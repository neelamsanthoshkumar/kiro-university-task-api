---
inclusion: always
---

# Error Handling Standards

All code must handle errors gracefully to ensure the API remains stable and provides helpful feedback to users.

## Core Principles

1. **All errors must be caught and handled** - No unhandled promise rejections or exceptions
2. **Errors must be logged with context** - Include relevant information for debugging
3. **Never expose sensitive data** - Passwords, tokens, API keys must never be logged or returned
4. **Return user-friendly messages** - Error messages should help users understand and fix issues
5. **Use try-catch blocks** - Wrap all async operations in try-catch blocks

## Try-Catch Pattern for Async Operations

### ✅ CORRECT - All async operations wrapped

```javascript
/**
 * Create a new task
 */
async function createTask(req, res) {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    // Validation
    const validationError = validateTaskData(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid task data provided',
          details: validationError
        }
      });
    }
    
    // Database operation
    const task = await taskService.create({
      title,
      description,
      priority,
      dueDate,
      userId: req.user.id
    });
    
    return res.status(201).json({
      success: true,
      data: task,
      error: null
    });
    
  } catch (error) {
    console.error('Error creating task:', {
      userId: req.user?.id,
      error: error.message,
      stack: error.stack
    });
    
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
```

### ❌ WRONG - No error handling

```javascript
// NEVER DO THIS
async function createTask(req, res) {
  const task = await taskService.create(req.body); // Can throw unhandled error
  return res.json(task);
}
```

## Error Logging Guidelines

### ✅ CORRECT - Log with context, no sensitive data

```javascript
console.error('Authentication failed:', {
  userId: user.id,
  email: user.email,
  timestamp: new Date().toISOString(),
  error: error.message
});
```

### ❌ WRONG - Logging sensitive data

```javascript
// NEVER LOG PASSWORDS, TOKENS, OR SENSITIVE DATA
console.error('Authentication failed:', {
  password: req.body.password,  // ❌ NEVER LOG PASSWORDS
  token: req.headers.authorization,  // ❌ NEVER LOG TOKENS
  error: error
});
```

## Validation Error Handling

Validation errors should provide field-level details to help users fix their input.

### Example: Field-Level Validation Errors

```javascript
/**
 * Validate task data
 * @returns {Object|null} Validation errors or null if valid
 */
function validateTaskData(data) {
  const errors = {};
  
  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be 200 characters or less';
  }
  
  // Priority validation
  const validPriorities = ['low', 'medium', 'high'];
  if (!data.priority || !validPriorities.includes(data.priority)) {
    errors.priority = `Priority must be one of: ${validPriorities.join(', ')}`;
  }
  
  // Due date validation
  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = 'Invalid date format';
    } else if (dueDate < new Date()) {
      errors.dueDate = 'Due date must be in the future';
    }
  }
  
  // Return null if no errors, otherwise return errors object
  return Object.keys(errors).length > 0 ? { fields: errors } : null;
}
```

### Example: Validation Error Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid task data provided",
    "details": {
      "fields": {
        "title": "Title is required",
        "priority": "Priority must be one of: low, medium, high",
        "dueDate": "Due date must be in the future"
      }
    }
  }
}
```

## Database Error Handling

Handle database errors gracefully and don't expose internal database details.

### ✅ CORRECT - Generic error message to user

```javascript
try {
  const task = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: `Task with ID '${taskId}' does not exist`,
        details: {}
      }
    });
  }
  
  return res.json({ success: true, data: task, error: null });
  
} catch (error) {
  // Log the actual database error for debugging
  console.error('Database error fetching task:', {
    taskId,
    error: error.message,
    stack: error.stack
  });
  
  // Return generic error to user
  return res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Failed to retrieve task. Please try again later.',
      details: {}
    }
  });
}
```

### ❌ WRONG - Exposing database details

```javascript
// NEVER DO THIS
try {
  const task = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
} catch (error) {
  return res.status(500).json({
    error: error.message  // ❌ Exposes SQL error messages
  });
}
```

## Authentication Error Handling

### Example: JWT Validation

```javascript
/**
 * Verify JWT token middleware
 */
function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication token is required',
          details: {}
        }
      });
    }
    
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
    
  } catch (error) {
    // Log error with context, but not the token itself
    console.error('Token verification failed:', {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    return res.status(401).json({
      success: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired authentication token',
        details: {}
      }
    });
  }
}
```

## Global Error Handler (Express Example)

Implement a global error handler to catch any unhandled errors.

```javascript
/**
 * Global error handling middleware (must be last)
 */
function globalErrorHandler(err, req, res, next) {
  // Log the full error for debugging
  console.error('Unhandled error:', {
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    error: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  
  // Return generic error response
  return res.status(500).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      details: {
        requestId: req.id || 'unknown'
      }
    }
  });
}

// Register as last middleware
app.use(globalErrorHandler);
```

## Error Handling Checklist

When implementing any endpoint or function:

- [ ] Wrap all async operations in try-catch blocks
- [ ] Validate input data and return field-level errors
- [ ] Log errors with context (but never sensitive data)
- [ ] Return user-friendly error messages
- [ ] Use appropriate HTTP status codes
- [ ] Follow the standard error response format
- [ ] Handle database errors gracefully
- [ ] Never expose internal error details (stack traces, SQL errors)
- [ ] Test error scenarios (invalid input, missing data, server errors)
