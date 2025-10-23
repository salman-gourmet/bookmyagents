# API Endpoints Documentation

## Admin Blog Management Endpoints

### GET /api/admin/blogs
Get all blogs for admin (all statuses)

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of blogs per page (default: 10)
- `status` (string, optional): Filter by status ('pending', 'approved', 'rejected')
- `author` (string, optional): Filter by author ID
- `search` (string, optional): Search in title and content

**Response:**
```json
{
  "data": {
    "blogs": [
      {
        "_id": "string",
        "title": "string",
        "slug": "string",
        "content": "string",
        "coverImage": "string",
        "author": {
          "_id": "string",
          "email": "string"
        },
        "likes": ["string"],
        "dislikes": ["string"],
        "status": "pending" | "approved" | "rejected",
        "approvedBy": {
          "_id": "string",
          "email": "string"
        },
        "approvedAt": "Date",
        "isPublished": boolean,
        "publishedAt": "Date",
        "createdAt": "Date",
        "updatedAt": "Date"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "pages": number
    },
    "statusCounts": [
      {
        "_id": "pending",
        "count": number
      },
      {
        "_id": "approved", 
        "count": number
      },
      {
        "_id": "rejected",
        "count": number
      }
    ]
  }
}
```

### PUT /api/admin/blogs/[id]/approve
Approve a blog post

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "slug": "string",
  "content": "string",
  "coverImage": "string",
  "author": "string",
  "likes": ["string"],
  "dislikes": ["string"],
  "status": "approved",
  "approvedBy": "string",
  "approvedAt": "Date",
  "isPublished": boolean,
  "publishedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### PUT /api/admin/blogs/[id]/reject
Reject a blog post

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "slug": "string",
  "content": "string",
  "coverImage": "string",
  "author": "string",
  "likes": ["string"],
  "dislikes": ["string"],
  "status": "rejected",
  "approvedBy": "string",
  "approvedAt": "Date",
  "isPublished": boolean,
  "publishedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### GET /api/admin/blogs/stats
Get blog statistics

**Response:**
```json
{
  "totalBlogs": number,
  "pendingBlogs": number,
  "approvedBlogs": number,
  "rejectedBlogs": number,
  "publishedBlogs": number,
  "blogsByMonth": [
    {
      "month": "string",
      "count": number
    }
  ]
}
```

### GET /api/blogs/[id]
Get a single blog post by ID

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "slug": "string",
  "content": "string",
  "coverImage": "string",
  "author": "string",
  "likes": ["string"],
  "dislikes": ["string"],
  "status": "pending" | "approved" | "rejected",
  "approvedBy": "string",
  "approvedAt": "Date",
  "isPublished": boolean,
  "publishedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### DELETE /api/admin/blogs/[id]
Delete a blog post

**Response:**
```json
{
  "message": "Blog deleted successfully"
}
```

### POST /api/admin/blogs
Create a new blog post

**Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "coverImage": "string (optional)",
  "isPublished": boolean (optional, default: false)
}
```

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "slug": "string",
  "content": "string",
  "coverImage": "string",
  "author": "string",
  "likes": ["string"],
  "dislikes": ["string"],
  "status": "pending",
  "approvedBy": null,
  "approvedAt": null,
  "isPublished": boolean,
  "publishedAt": null,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### PUT /api/admin/blogs/[id]
Update a blog post

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "coverImage": "string (optional)",
  "isPublished": boolean (optional)
}
```

**Response:**
```json
{
  "_id": "string",
  "title": "string",
  "slug": "string",
  "content": "string",
  "coverImage": "string",
  "author": "string",
  "likes": ["string"],
  "dislikes": ["string"],
  "status": "pending" | "approved" | "rejected",
  "approvedBy": "string",
  "approvedAt": "Date",
  "isPublished": boolean,
  "publishedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### POST /api/admin/blogs/upload-image
Upload blog cover image

**Request:**
- Content-Type: multipart/form-data
- Body: image file

**Response:**
```json
{
  "url": "string",
  "filename": "string",
  "size": number
}
```

## Blog Schema

```typescript
interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  author: IUser['_id'];
  likes: IUser['_id'][];
  dislikes: IUser['_id'][];
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: IUser['_id'];
  approvedAt?: Date;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Authentication

All admin endpoints require authentication with a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Insufficient permissions (admin role required)
- `404 Not Found`: Blog not found
- `500 Internal Server Error`: Server error

Example error response:
```json
{
  "error": "string",
  "message": "string",
  "statusCode": number
}
```