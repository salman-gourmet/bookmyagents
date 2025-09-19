# API Endpoints Documentation

This document outlines the expected API endpoints for the TourEx application.

## Base URL
```
http://localhost:3000/api
```

**Note**: In development, the frontend uses a proxy configuration in Vite, so API calls are made to `/api` which gets proxied to `http://localhost:3000/api`.

## Authentication Endpoints

### POST /auth/login
Login user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here",
  "message": "Login successful"
}
```

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here",
  "message": "Registration successful"
}
```

### POST /auth/logout
Logout user (optional server-side token invalidation).

**Headers:**
```
Authorization: Bearer <token>
```

### GET /auth/me
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /auth/refresh
Refresh JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "token": "new_jwt_token_here"
}
```

### GET /auth/verify
Verify if token is valid.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true
}
```

## User Management Endpoints

### GET /users
Get all users with pagination and filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name or email
- `role` (optional): Filter by role

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### GET /users/:id
Get user by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /users
Create new user (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

### PUT /users/:id
Update user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "user@example.com",
  "role": "admin"
}
```

### DELETE /users/:id
Delete user.

**Headers:**
```
Authorization: Bearer <token>
```

### PUT /users/:id/password
Update user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### GET /users/stats
Get user statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalUsers": 100,
  "activeUsers": 85,
  "newUsersThisMonth": 15
}
```

## Subscription Management Endpoints

### GET /subscription
Get all subscriptions with pagination and filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for subscription name
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "subscriptions": [
    {
      "id": "sub_123",
      "name": "Basic Plan",
      "price": 29.99,
      "features": [
        "Basic travel planning",
        "Email support",
        "Standard destinations"
      ],
      "description": "Perfect for individual travelers",
      "duration": "monthly",
      "isPopular": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "sub_456",
      "name": "Premium Plan",
      "price": 59.99,
      "features": [
        "Advanced travel planning",
        "Priority support",
        "Premium destinations",
        "Travel insurance",
        "24/7 assistance"
      ],
      "description": "Ideal for frequent travelers",
      "duration": "monthly",
      "isPopular": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}
```

### GET /subscription/:id
Get subscription by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "sub_123",
  "name": "Basic Plan",
  "price": 29.99,
  "features": [
    "Basic travel planning",
    "Email support",
    "Standard destinations"
  ],
  "description": "Perfect for individual travelers",
  "duration": "monthly",
  "isPopular": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /subscription
Create new subscription (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Enterprise Plan",
  "price": 99.99,
  "features": [
    "Unlimited travel planning",
    "Dedicated support",
    "All destinations",
    "Premium travel insurance",
    "Concierge service"
  ],
  "description": "For large organizations",
  "duration": "monthly",
  "isPopular": false
}
```

**Response:**
```json
{
  "id": "sub_789",
  "name": "Enterprise Plan",
  "price": 99.99,
  "features": [
    "Unlimited travel planning",
    "Dedicated support",
    "All destinations",
    "Premium travel insurance",
    "Concierge service"
  ],
  "description": "For large organizations",
  "duration": "monthly",
  "isPopular": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /subscription/:id
Update subscription (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Plan Name",
  "price": 79.99,
  "features": [
    "Updated feature 1",
    "Updated feature 2"
  ],
  "description": "Updated description",
  "isPopular": true
}
```

### DELETE /subscription/:id
Delete subscription (admin only).

**Headers:**
```
Authorization: Bearer <token>
```

### GET /subscription/stats
Get subscription statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalSubscriptions": 5,
  "averagePrice": 49.99,
  "mostPopular": "Premium Plan"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "message": "Access forbidden"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Notes

1. All authentication endpoints (except login/register) require a valid JWT token in the Authorization header.
2. User management endpoints may require admin privileges depending on your backend implementation.
3. The frontend expects CORS to be enabled for localhost:5173 (Vite dev server).
4. Password should be hashed on the backend before storing in the database.
5. JWT tokens should have an expiration time and be properly validated.
