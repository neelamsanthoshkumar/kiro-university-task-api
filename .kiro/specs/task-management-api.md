# Feature Spec: Personal Task Management API

## Overview
A RESTful API for personal task management with user authentication, task CRUD operations, filtering capabilities, and notification system.

## Requirements

### 1. User Management

#### REQ-1.1: User Registration
**WHEN** a user submits registration data with email, password, and name  
**THE SYSTEM SHALL** validate the input, hash the password, create the user account, and return user details with success status

**Acceptance Criteria:**
- Email must be valid format
- Password must be at least 8 characters
- Email must be unique (no duplicates)
- Password is hashed with bcrypt (salt rounds: 10)
- Return 201 status on success
- Never return password in response

**Property Tests:**
- Email validation accepts valid formats and rejects invalid ones
- Password hashing always produces different hashes for same password (due to salt)

#### REQ-1.2: User Login
**WHEN** a user submits valid email and password  
**THE SYSTEM SHALL** verify credentials, generate a JWT token valid for 24 hours, and return the token with user details

**Acceptance Criteria:**
- Verify password using bcrypt.compare
- Generate JWT with userId and email (no sensitive data)
- Token expires in 24 hours
- Return 401 for invalid credentials
- Use same error message for wrong email or password (security)

**Property Tests:**
- Valid credentials always generate a token
- Invalid credentials always return 401
- Generated tokens are valid for 24 hours

#### REQ-1.3: Authentication Middleware
**WHEN** a protected endpoint is accessed  
**THE SYSTEM SHALL** validate the JWT token from Authorization header and reject invalid or missing tokens

**Acceptance Criteria:**
- Extract token from "Bearer TOKEN" format
- Verify token signature and expiration
- Attach decoded user to request object
- Return 401 for missing or invalid tokens

---

### 2. Task Management

#### REQ-2.1: Create Task
**WHEN** an authenticated user submits task data  
**THE SYSTEM SHALL** validate the input, create the task, associate it with the user, and return the created task

**Acceptance Criteria:**
- Title is required (1-200 characters)
- Description is optional (max 1000 characters)
- Priority must be one of: low, medium, high (required)
- Status defaults to "pending"
- DueDate must be in the future (if provided)
- Tags are optional array of strings
- Task is associated with authenticated user
- Return 201 status on success

**Validation Rules:**
- Title: required, 1-200 chars, sanitized
- Description: optional, max 1000 chars, sanitized
- Priority: enum [low, medium, high]
- Status: enum [pending, in-progress, completed]
- DueDate: future date in ISO format
- Tags: array of strings, max 10 tags

**Property Tests:**
- Priority only accepts: low, medium, high
- Status transitions follow: pending → in-progress → completed
- DueDate must always be in the future when provided
- Title length is always between 1 and 200 characters

#### REQ-2.2: Get All Tasks
**WHEN** an authenticated user requests their tasks  
**THE SYSTEM SHALL** return all tasks owned by the user with pagination support

**Acceptance Criteria:**
- Return only tasks owned by authenticated user
- Support pagination (page, pageSize query params)
- Default pageSize: 20, max: 100
- Return total count and pagination metadata
- Order by created_at DESC by default

#### REQ-2.3: Get Task by ID
**WHEN** an authenticated user requests a specific task  
**THE SYSTEM SHALL** return the task if owned by the user, or 404 if not found or not owned

**Acceptance Criteria:**
- Verify task ownership (user can only access their tasks)
- Return 404 if task doesn't exist
- Return 404 if task exists but owned by different user (security)

**Property Tests:**
- Users can never access tasks owned by other users

#### REQ-2.4: Update Task
**WHEN** an authenticated user submits updated task data  
**THE SYSTEM SHALL** validate ownership, validate input, update the task, and return updated task

**Acceptance Criteria:**
- Verify task ownership
- Validate all fields as per create rules
- Update only provided fields (partial update)
- Update updatedAt timestamp
- Return 404 if task not found or not owned

**Property Tests:**
- Status can only transition forward: pending → in-progress → completed
- Cannot set status backward (completed → pending)

#### REQ-2.5: Delete Task
**WHEN** an authenticated user requests to delete a task  
**THE SYSTEM SHALL** verify ownership and delete the task

**Acceptance Criteria:**
- Verify task ownership
- Delete task from database
- Return 200 with success message
- Return 404 if task not found or not owned

#### REQ-2.6: Filter Tasks
**WHEN** an authenticated user requests filtered tasks  
**THE SYSTEM SHALL** apply filters and return matching tasks

**Filters:**
- status: pending, in-progress, completed
- priority: low, medium, high
- tags: comma-separated tag names
- dueBefore: ISO date string
- dueAfter: ISO date string

**Acceptance Criteria:**
- All filters are optional
- Multiple filters combine with AND logic
- Case-insensitive tag matching
- Date filters use ISO format

---

### 3. Notifications

#### REQ-3.1: Task Due Notification Check
**WHEN** the system checks for tasks due within 24 hours  
**THE SYSTEM SHALL** identify tasks due soon and create notifications

**Acceptance Criteria:**
- Identify tasks with due date within next 24 hours
- Create notification for task owner
- Notification includes task title and due date
- Don't create duplicate notifications

#### REQ-3.2: Get User Notifications
**WHEN** an authenticated user requests notifications  
**THE SYSTEM SHALL** return all notifications for the user

**Acceptance Criteria:**
- Return notifications for authenticated user only
- Include read/unread status
- Order by created_at DESC
- Include related task details

#### REQ-3.3: Mark Notification as Read
**WHEN** a user marks a notification as read  
**THE SYSTEM SHALL** update the notification status

**Acceptance Criteria:**
- Verify notification ownership
- Update isRead to true
- Return updated notification

---

## Technical Design

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority VARCHAR(10) NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in-progress', 'completed')),
  due_date DATETIME,
  tags TEXT, -- JSON array stored as text
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Tasks (Protected - require JWT)
- `GET /api/tasks` - Get all user tasks (with filters & pagination)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Notifications (Protected - require JWT)
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

### Technology Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: jsonwebtoken, bcrypt
- **Validation**: Custom validation functions
- **Testing**: Jest with property-based testing
- **Documentation**: Mintlify

### Project Structure
```
task-management-api/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection & setup
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Global error handler
│   │   └── responseFormatter.js # Standard response format
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── taskRoutes.js        # Task endpoints
│   │   └── notificationRoutes.js # Notification endpoints
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── taskController.js    # Task logic
│   │   └── notificationController.js
│   ├── services/
│   │   ├── authService.js       # Auth business logic
│   │   ├── taskService.js       # Task business logic
│   │   └── notificationService.js
│   ├── repositories/
│   │   ├── userRepository.js    # User data access
│   │   ├── taskRepository.js    # Task data access
│   │   └── notificationRepository.js
│   ├── utils/
│   │   ├── validation.js        # Validation helpers
│   │   └── sanitization.js      # Input sanitization
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── property/                # Property-based tests
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Implementation Tasks

### Phase 1: Project Setup
- [ ] Initialize Node.js project
- [ ] Install dependencies
- [ ] Setup database schema
- [ ] Create basic Express app structure
- [ ] Setup environment variables

### Phase 2: Authentication
- [ ] Implement user registration (REQ-1.1)
- [ ] Implement user login (REQ-1.2)
- [ ] Implement JWT middleware (REQ-1.3)
- [ ] Add input validation
- [ ] Add password hashing

### Phase 3: Task Management
- [ ] Implement create task (REQ-2.1)
- [ ] Implement get all tasks (REQ-2.2)
- [ ] Implement get task by ID (REQ-2.3)
- [ ] Implement update task (REQ-2.4)
- [ ] Implement delete task (REQ-2.5)
- [ ] Implement task filtering (REQ-2.6)

### Phase 4: Notifications
- [ ] Implement notification creation logic (REQ-3.1)
- [ ] Implement get notifications (REQ-3.2)
- [ ] Implement mark as read (REQ-3.3)

### Phase 5: Testing
- [ ] Unit tests for validation functions
- [ ] Property-based tests for business rules
- [ ] Integration tests for API endpoints
- [ ] Test edge cases and error scenarios

### Phase 6: Documentation
- [ ] API documentation with Mintlify
- [ ] Setup guide in README
- [ ] Environment variables documentation

---

## Property-Based Test Cases

1. **Email Validation**: Test with random valid/invalid email formats
2. **Password Hashing**: Verify same password produces different hashes
3. **Priority Validation**: Only accepts: low, medium, high
4. **Status Transitions**: Can only go forward (pending → in-progress → completed)
5. **Date Validation**: Due dates must always be in future
6. **Ownership**: Users can never access other users' tasks
7. **Token Expiration**: Tokens expire after 24 hours

---

## Security Considerations

1. **Password Security**: Bcrypt with 10 salt rounds
2. **SQL Injection**: Parameterized queries only
3. **Authentication**: JWT tokens, secure secret
4. **Authorization**: Ownership verification on all operations
5. **Input Validation**: Sanitize all user input
6. **Error Messages**: Generic messages (don't reveal internals)
7. **CORS**: Configured for allowed origins
8. **Rate Limiting**: Prevent abuse (future enhancement)

---

## Success Criteria

- ✅ All API endpoints working and tested
- ✅ Authentication and authorization implemented
- ✅ All validation rules enforced
- ✅ Property-based tests passing
- ✅ Standard response format followed
- ✅ Error handling working correctly
- ✅ Security best practices applied
- ✅ Documentation complete
- ✅ Demonstrates all 7 Kiro University lessons
