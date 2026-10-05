---
inclusion: always
---

# API Response Standards

All API endpoints must return responses in a consistent, predictable format. This ensures clients can handle responses uniformly across the entire API.

## Response Structure

### Success Response Format

All successful API responses must follow this structure:

```json
{
  "success": true,
  "data": {
    // Response data goes here
  },
  "error": null
}
```

### Error Response Format

All error responses must follow this structure:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": {
      // Optional additional error context
    }
  }
}
```

## HTTP Status Codes

Use the following HTTP status codes consistently:

- **200 OK** - Successful GET, PUT, or DELETE request
- **201 Created** - Successful POST request that creates a resource
- **400 Bad Request** - Invalid request data or validation errors
- **401 Unauthorized** - Missing or invalid authentication token
- **404 Not Found** - Requested resource does not exist
- **500 Internal Server Error** - Unexpected server error

## Response Examples

### Example 1: Successful Task Creation (201)

```json
{
  "success": true,
  "data": {
    "id": "task_123",
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "priority": "high",
    "status": "pending",
    "dueDate": "2026-10-10T00:00:00Z",
    "tags": ["documentation", "urgent"],
    "createdAt": "2026-10-05T10:30:00Z",
    "updatedAt": "2026-10-05T10:30:00Z"
  },
  "error": null
}
```

### Example 2: Successful Task List Retrieval (200)

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_123",
        "title": "Complete project documentation",
        "priority": "high",
        "status": "pending"
      },
      {
        "id": "task_124",
        "title": "Review code changes",
        "priority": "medium",
        "status": "in-progress"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "pageSize": 20,
      "totalPages": 3
    }
  },
  "error": null
}
```

### Example 3: Validation Error (400)

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "dueDate": "Due date must be in the future",
        "priority": "Priority must be one of: low, medium, high"
      }
    }
  }
}
```

### Example 4: Authentication Error (401)

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication token is missing or invalid",
    "details": {}
  }
}
```

### Example 5: Resource Not Found (404)

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Task with ID 'task_999' does not exist",
    "details": {
      "resourceType": "task",
      "resourceId": "task_999"
    }
  }
}
```

### Example 6: Server Error (500)

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "details": {
      "requestId": "req_abc123"
    }
  }
}
```

## Standard Error Codes

Use these consistent error codes across the API:

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - User lacks permission for this action
- `NOT_FOUND` - Requested resource does not exist
- `CONFLICT` - Request conflicts with current state (e.g., duplicate resource)
- `RATE_LIMITED` - Too many requests from this client
- `INTERNAL_ERROR` - Unexpected server error

## Implementation Guidelines

1. **Always wrap responses** in the standard format, even for errors
2. **Use middleware** to automatically format responses
3. **Include meaningful error codes** that clients can programmatically handle
4. **Provide helpful error messages** that guide users to fix issues
5. **Never expose internal error details** (stack traces, database errors) to clients
6. **Include request IDs** in server errors for debugging
7. **Return appropriate HTTP status codes** matching the error type
