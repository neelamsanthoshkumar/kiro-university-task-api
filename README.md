# Task Management API - Kiro University Challenge Project

A RESTful API for personal task management with user authentication, task CRUD operations, filtering capabilities, and notification system.

## 🎯 Project Overview

This project was built as part of the **Kiro University Challenge** to demonstrate all 7 required lessons plus 2 bonus lessons. It's a fully functional Task Management API that showcases modern development practices, proper architecture, and comprehensive testing.

## ✨ Features

- **User Authentication**: JWT-based registration and login
- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter by status, priority, tags, and due date
- **Notifications**: Automatic notifications for tasks due within 24 hours
- **Input Validation**: Comprehensive validation and sanitization
- **Security**: Bcrypt password hashing, JWT tokens, SQL injection prevention
- **Standard API**: Consistent response format across all endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: jsonwebtoken, bcrypt
- **Testing**: Jest with fast-check (property-based testing)
- **Documentation**: Mintlify

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and set your JWT_SECRET
   ```

4. **Initialize database**
   ```bash
   npm run db:setup
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The API will be running at `http://localhost:3000`

## 🔐 API Endpoints

### Authentication (Public)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Tasks (Protected - Requires JWT)

#### Get All Tasks
```http
GET /api/tasks?status=pending&priority=high&page=1&pageSize=20
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README",
  "priority": "high",
  "dueDate": "2026-10-10T00:00:00Z",
  "tags": ["documentation", "urgent"]
}
```

#### Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "medium"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Notifications (Protected)

#### Get Notifications
```http
GET /api/notifications
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Mark as Read
```http
PATCH /api/notifications/:id/read
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🎓 Kiro University Challenge - Lessons Demonstrated

### Lesson 1: Spec-driven Development ✅
**Location**: `.kiro/specs/task-management-api.md`

Complete feature specification with:
- Structured requirements using EARS notation
- Technical design decisions
- Database schema
- Implementation tasks
- Property-based test cases

### Lesson 2: Steering Documents ✅
**Location**: `.kiro/steering/`

Four steering files enforcing project standards:
- `api-standards.md` - Consistent API response format
- `error-handling.md` - Error handling patterns
- `security-standards.md` - Security best practices
- `code-style.md` - Coding conventions

### Lesson 3: Hooks ✅
**Location**: `.kiro/hooks/`

Automated workflows:
- `lint-on-save.json` - Auto-lint on file save
- `test-after-task.json` - Run tests after spec tasks
- `review-writes.json` - Review code writes for standards

### Lesson 4: Property-based Testing ✅
**Location**: `tests/property/`

Property-based tests for:
- Email validation
- Password hashing
- Priority enum validation
- Status transitions
- Date validation
- User ownership rules

### Lesson 5: Powers ✅
**Used**: Mintlify power for API documentation

Generated comprehensive API documentation using the Mintlify power, including:
- Endpoint reference
- Request/response schemas
- Authentication guide
- Error codes

### Lesson 6: Model Context Protocol (MCP) ✅
**Location**: `.kiro/settings/mcp.json`

Configured MCP servers:
- `fetch` - For external HTTP requests
- Used for webhook notifications and external integrations

### Lesson 7: Custom Agents ✅
**Location**: `.kiro/agents/`

Three specialized agents:
- `backend-dev.json` - Backend API development
- `testing-agent.json` - Testing and QA
- `docs-agent.json` - Documentation maintenance

### Bonus Lesson 1: Cloud Sessions ⭐
Used Kiro cloud sessions for:
- Running long builds off local machine
- Syncing .kiro configuration to cloud
- Collaborative development

### Bonus Lesson 2: Package a Kiro Power ⭐
**Location**: `task-management-power/`

Created custom power with:
- `plugin.json` manifest
- Skills for task management patterns
- Reusable workflows

## 🧪 Testing

Run all tests:
```bash
npm test
```

Run only property-based tests:
```bash
npm run test:property
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with 10 salt rounds
- **JWT Authentication**: 24-hour token expiration
- **SQL Injection Prevention**: Parameterized queries only
- **Input Validation**: Comprehensive validation and sanitization
- **Authorization**: Users can only access their own data
- **CORS**: Configured for allowed origins
- **Error Handling**: No sensitive data in error responses

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

**Error Response:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

## 🏗️ Project Structure

```
task-management-api/
├── .kiro/                    # Kiro configuration
│   ├── specs/               # Feature specifications
│   ├── steering/            # Steering documents
│   ├── hooks/               # Automation hooks
│   ├── agents/              # Custom agents
│   └── settings/            # MCP configuration
├── src/
│   ├── config/              # Database & config
│   ├── middleware/          # Auth, error handling
│   ├── routes/              # API routes
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   ├── repositories/        # Data access
│   ├── utils/               # Validation, sanitization
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── property/
├── .env                     # Environment variables
├── package.json
└── README.md
```

## 🚀 Development

```bash
# Start development server with auto-reload
npm run dev

# Run linter
npm run lint

# Setup/reset database
npm run db:setup
```

## 📊 Database Schema

### Users
- id, email, password_hash, name, created_at, updated_at

### Tasks
- id, user_id, title, description, priority, status, due_date, tags, created_at, updated_at

### Notifications
- id, user_id, task_id, message, is_read, created_at

## 🎥 Demo Video

[![Kiro University Challenge Demo](https://img.youtube.com/vi/jelt1hh6fcw/maxresdefault.jpg)](https://youtu.be/jelt1hh6fcw)

**Watch the 2-minute demo:** https://youtu.be/jelt1hh6fcw

Shows:
- Working API with live demo
- All 7 lessons demonstrated
- Production architecture overview

## 📜 License

MIT

## 👤 Author

Built with Kiro for the Kiro University Challenge 2026

#KiroUniversity #BuildWithKiro
