# **5. API Specification**

The complete API specification for the platform based on implemented and planned endpoints.

## **Base Configuration**
- **Base URL:** `https://api.shikhilab.com/v1`
- **Authentication:** Bearer JWT tokens required for protected endpoints
- **Content-Type:** `application/json`
- **Security:** Rate limiting, CORS policies, input validation

## **Core Endpoints (Implemented/Planned)**

### **Authentication Endpoints**
```
POST /auth/login          # User login
POST /auth/refresh        # Token refresh
POST /auth/logout         # User logout
```

### **Public Endpoints**
```
POST /enrollments         # Submit enrollment application
GET  /health             # Health check endpoint
```

### **Admin Endpoints** (Require admin role)
```
GET  /admin/users                    # List all students for enrollment assignment
GET  /admin/enrollments              # List pending enrollments
POST /admin/enrollments/{id}/approve # Approve enrollment
POST /admin/enrollments/{id}/reject  # Reject enrollment
```

### **Course Management Endpoints** (Admin only)
```
POST /courses                        # Create new course
GET  /courses                        # List all courses
GET  /courses/{id}                   # Get course details
POST /courses/{id}/classes           # Add class to course
GET  /courses/{id}/classes           # Get course classes
POST /courses/{id}/enrollments       # Assign students to course
```

### **Student Endpoints** (Require authentication)
```
GET  /courses/my                     # Get student's enrolled courses
GET  /classes/{id}                   # Get class details and materials
GET  /dashboard/weaknesses           # Get personalized weakness analysis
```

### **Content Management Endpoints** (Admin only)
```
POST /classes/{id}/materials         # Add learning materials to class
PUT  /materials/{id}                 # Update learning material
DELETE /materials/{id}               # Delete learning material
GET  /mistake-categories             # List available mistake categories
```

## **Response Patterns**

### **Success Responses**
- **200 OK:** Successful GET requests
- **201 Created:** Successful resource creation
- **204 No Content:** Successful DELETE/UPDATE with no response body

### **Error Responses**
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Missing or invalid authentication
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **409 Conflict:** Resource conflict (e.g., duplicate email)
- **422 Unprocessable Entity:** Validation errors
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** Server error

### **Error Response Format**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

-----
