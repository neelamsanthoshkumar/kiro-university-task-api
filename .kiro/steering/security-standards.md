---
inclusion: always
---

# Security Standards

All code must follow security best practices to protect user data and prevent vulnerabilities.

## Core Security Principles

1. **Never store passwords in plain text** - Always hash passwords using bcrypt or similar
2. **Always validate and sanitize user input** - Prevent injection attacks
3. **Use parameterized queries** - Prevent SQL injection
4. **Validate JWT tokens** - Verify authentication on protected endpoints
5. **Never expose sensitive data** - Don't log or return passwords, tokens, API keys
6. **Set proper CORS headers** - Control cross-origin access
7. **Use HTTPS in production** - Encrypt data in transit
8. **Apply principle of least privilege** - Users should only access their own data

## Password Security

### ✅ CORRECT - Hash passwords with bcrypt

```javascript
const bcrypt = require('bcrypt');

/**
 * Register a new user
 */
async function registerUser(req, res) {
  try {
    const { email, password, name } = req.body;
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 8 characters long',
          details: {}
        }
      });
    }
    
    // Hash password with salt rounds of 10
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Store hashed password in database
    const user = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name]
    );
    
    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      error: null
    });
    
  } catch (error) {
    console.error('Error registering user:', {
      email: req.body.email,
      error: error.message
      // ✅ Never log the password
    });
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to register user',
        details: {}
      }
    });
  }
}
```

### ✅ CORRECT - Verify passwords with bcrypt

```javascript
/**
 * Login user
 */
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    
    // Fetch user from database
    const user = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
          details: {}
        }
      });
    }
    
    // Compare password with hashed password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
          details: {}
        }
      });
    }
    
    // Generate JWT token (no sensitive data in token)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      error: null
    });
    
  } catch (error) {
    console.error('Login error:', { email: req.body.email });
    // ✅ Never log the password
    
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Login failed',
        details: {}
      }
    });
  }
}
```

### ❌ WRONG - Storing plain text passwords

```javascript
// NEVER DO THIS
async function registerUser(req, res) {
  const { email, password } = req.body;
  
  // ❌ NEVER store passwords in plain text
  await db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, password]
  );
}
```

## Input Validation and Sanitization

Always validate and sanitize user input to prevent injection attacks.

### ✅ CORRECT - Validate and sanitize input

```javascript
/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input (remove dangerous characters)
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
 * Create task with validation
 */
async function createTask(req, res) {
  try {
    const { title, description, priority } = req.body;
    
    // Validate required fields
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title is required',
          details: {}
        }
      });
    }
    
    // Sanitize inputs
    const sanitizedTitle = sanitizeString(title);
    const sanitizedDescription = sanitizeString(description || '');
    
    // Validate priority enum
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Priority must be one of: ${validPriorities.join(', ')}`,
          details: {}
        }
      });
    }
    
    // Use parameterized query (see next section)
    const task = await db.query(
      'INSERT INTO tasks (title, description, priority, user_id) VALUES (?, ?, ?, ?)',
      [sanitizedTitle, sanitizedDescription, priority, req.user.id]
    );
    
    return res.status(201).json({
      success: true,
      data: task,
      error: null
    });
    
  } catch (error) {
    console.error('Error creating task:', error.message);
    return res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create task',
        details: {}
      }
    });
  }
}
```

## SQL Injection Prevention

Always use parameterized queries to prevent SQL injection attacks.

### ✅ CORRECT - Parameterized queries

```javascript
// Use placeholders (?) and pass values as array
const task = await db.query(
  'SELECT * FROM tasks WHERE user_id = ? AND status = ?',
  [userId, status]
);

// For multiple inserts
const tasks = await db.query(
  'INSERT INTO tasks (title, user_id) VALUES (?, ?), (?, ?)',
  [title1, userId, title2, userId]
);
```

### ❌ WRONG - String concatenation (SQL Injection vulnerability)

```javascript
// NEVER DO THIS - Vulnerable to SQL injection
const task = await db.query(
  `SELECT * FROM tasks WHERE user_id = '${userId}'`
);

// Attacker could inject: userId = "1' OR '1'='1"
// Resulting query: SELECT * FROM tasks WHERE user_id = '1' OR '1'='1'
// This would return ALL tasks, bypassing security!
```

## JWT Token Validation

Validate JWT tokens on all protected endpoints.

### ✅ CORRECT - JWT middleware

```javascript
const jwt = require('jsonwebtoken');

/**
 * Middleware to validate JWT token
 */
function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
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
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    // Token is invalid or expired
    console.error('Token verification failed:', error.message);
    // ✅ Never log the actual token
    
    return res.status(401).json({
      success: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
        details: {}
      }
    });
  }
}

// Apply to protected routes
app.get('/api/tasks', authenticateToken, getTasksHandler);
app.post('/api/tasks', authenticateToken, createTaskHandler);
```

## Authorization - User Access Control

Users should only access their own data.

### ✅ CORRECT - Verify resource ownership

```javascript
/**
 * Get task by ID (with ownership check)
 */
async function getTask(req, res) {
  try {
    const { taskId } = req.params;
    const userId = req.user.id; // From JWT token
    
    // Fetch task with ownership check
    const task = await db.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );
    
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
    console.error('Error fetching task:', error.message);
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

### ❌ WRONG - No ownership check

```javascript
// NEVER DO THIS - Users could access other users' tasks
async function getTask(req, res) {
  const { taskId } = req.params;
  
  // ❌ No check for user_id - any authenticated user can access any task!
  const task = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
  
  return res.json({ data: task });
}
```

## CORS Configuration

Set proper CORS headers to control cross-origin access.

### ✅ CORRECT - Configured CORS

```javascript
const cors = require('cors');

// Configure CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## Environment Variables for Secrets

Never hardcode secrets in code. Use environment variables.

### ✅ CORRECT - Environment variables

```javascript
// .env file (NEVER commit this to git!)
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
DATABASE_URL=postgresql://user:password@localhost:5432/taskdb
PORT=3000

// In code
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET environment variable is required');
}
```

### ❌ WRONG - Hardcoded secrets

```javascript
// NEVER DO THIS
const JWT_SECRET = 'my-secret-key-123'; // ❌ Exposed in code
const token = jwt.sign(payload, 'my-secret-key-123'); // ❌ Hardcoded
```

## Security Checklist

For every endpoint:

- [ ] Use parameterized queries (never string concatenation)
- [ ] Validate all user input
- [ ] Sanitize string inputs
- [ ] Hash passwords with bcrypt (never store plain text)
- [ ] Verify JWT tokens on protected endpoints
- [ ] Check resource ownership (users can only access their data)
- [ ] Never log sensitive data (passwords, tokens, API keys)
- [ ] Never return sensitive data in responses
- [ ] Use environment variables for secrets
- [ ] Set proper CORS headers
- [ ] Use HTTPS in production
- [ ] Rate limit API endpoints to prevent abuse
