# ToolShare API Specifications

## Overview

This document provides comprehensive API specifications for the ToolShare platform, covering all endpoints for authentication, user management, item listings, transactions, messaging, and token management.

## Base URLs

- **Python Backend API**: `https://api.toolshare.app/api/v1`
- **Java Token Service**: `https://tokens.toolshare.app`
- **Firebase Functions**: `https://us-central1-toolshare-app.cloudfunctions.net`

## Authentication

All API endpoints (except authentication endpoints) require JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 1. Authentication API (`/auth`)

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "displayName": "John Doe",
  "locationCity": "London",
  "locationPostcode": "SW1A 1AA",
  "phoneNumber": "+447700900123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "displayName": "John Doe",
      "locationCity": "London",
      "locationPostcode": "SW1A 1AA",
      "trustTokenBalance": 5,
      "averageRating": 0.0,
      "totalLendingCount": 0,
      "totalBorrowingCount": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### POST `/auth/login`
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "displayName": "John Doe",
      "trustTokenBalance": 5
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### POST `/auth/refresh`
Refresh JWT token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### POST `/auth/logout`
Logout user and invalidate token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### POST `/auth/forgot-password`
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### 2. Users API (`/users`)

#### GET `/users/profile`
Get current user profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "locationCity": "London",
    "locationPostcode": "SW1A 1AA",
    "bio": "Tool enthusiast and community builder",
    "profileImageUrl": "https://storage.googleapis.com/profile_images/user123.jpg",
    "trustTokenBalance": 5,
    "averageRating": 4.5,
    "totalLendingCount": 12,
    "totalBorrowingCount": 8,
    "favoriteCategories": ["Power Tools", "Gardening"],
    "isAvailableForLending": true,
    "phoneNumber": "+447700900123",
    "pushNotificationsEnabled": true,
    "emailNotificationsEnabled": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT `/users/profile`
Update user profile.

**Request Body:**
```json
{
  "displayName": "John Smith",
  "bio": "Updated bio",
  "locationCity": "Manchester",
  "locationPostcode": "M1 1AA",
  "favoriteCategories": ["Power Tools", "Kitchen"],
  "isAvailableForLending": true,
  "pushNotificationsEnabled": true,
  "emailNotificationsEnabled": false
}
```

#### GET `/users/{userId}`
Get public user profile by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "displayName": "John Doe",
    "locationCity": "London",
    "locationPostcode": "SW1A 1AA",
    "bio": "Tool enthusiast",
    "profileImageUrl": "https://storage.googleapis.com/profile_images/user123.jpg",
    "averageRating": 4.5,
    "totalLendingCount": 12,
    "totalBorrowingCount": 8,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3. Items API (`/items`)

#### GET `/items`
Get list of available items with filtering and pagination.

**Query Parameters:**
- `page` (int, default: 1): Page number
- `limit` (int, default: 20): Items per page
- `category` (string): Filter by category
- `search` (string): Search in title and description
- `location` (string): Filter by location
- `radius` (float, default: 10): Search radius in km
- `sort` (string): Sort field (createdAt, rating, borrowCount)
- `order` (string, default: desc): Sort order (asc, desc)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "item123",
        "ownerId": "user123",
        "ownerName": "John Doe",
        "ownerImageUrl": "https://storage.googleapis.com/profile_images/user123.jpg",
        "title": "Power Drill Set",
        "description": "Complete cordless drill set with various bits",
        "category": "Power Tools",
        "imageUrls": [
          "https://storage.googleapis.com/item_images/item123_1.jpg",
          "https://storage.googleapis.com/item_images/item123_2.jpg"
        ],
        "locationCity": "London",
        "locationPostcode": "SW1A 1AA",
        "location": {
          "latitude": 51.5074,
          "longitude": -0.1278
        },
        "isAvailable": true,
        "availabilitySchedule": {
          "monday": ["09:00-17:00"],
          "tuesday": ["09:00-17:00"],
          "weekends": ["10:00-16:00"]
        },
        "condition": "Excellent",
        "tags": ["cordless", "versatile", "professional"],
        "includedAccessories": ["Battery charger", "Carrying case", "10 drill bits"],
        "instructions": "Please return clean and in working condition",
        "viewCount": 45,
        "borrowCount": 8,
        "averageRating": 4.7,
        "totalReviews": 6,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-10T15:30:00Z",
        "isVerified": true,
        "isFeatured": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 98,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### POST `/items`
Create a new item listing.

**Request Body:**
```json
{
  "title": "Power Drill Set",
  "description": "Complete cordless drill set with various bits",
  "category": "Power Tools",
  "imageUrls": [
    "https://storage.googleapis.com/item_images/item123_1.jpg",
    "https://storage.googleapis.com/item_images/item123_2.jpg"
  ],
  "locationCity": "London",
  "locationPostcode": "SW1A 1AA",
  "location": {
    "latitude": 51.5074,
    "longitude": -0.1278
  },
  "availabilitySchedule": {
    "monday": ["09:00-17:00"],
    "tuesday": ["09:00-17:00"],
    "weekends": ["10:00-16:00"]
  },
  "condition": "Excellent",
  "tags": ["cordless", "versatile", "professional"],
  "includedAccessories": ["Battery charger", "Carrying case", "10 drill bits"],
  "instructions": "Please return clean and in working condition"
}
```

#### GET `/items/{itemId}`
Get item details by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "item123",
    "title": "Power Drill Set",
    "description": "Complete cordless drill set with various bits",
    "category": "Power Tools",
    "imageUrls": [
      "https://storage.googleapis.com/item_images/item123_1.jpg",
      "https://storage.googleapis.com/item_images/item123_2.jpg"
    ],
    "owner": {
      "id": "user123",
      "displayName": "John Doe",
      "profileImageUrl": "https://storage.googleapis.com/profile_images/user123.jpg",
      "averageRating": 4.5,
      "totalLendingCount": 12
    },
    "locationCity": "London",
    "locationPostcode": "SW1A 1AA",
    "location": {
      "latitude": 51.5074,
      "longitude": -0.1278
    },
    "isAvailable": true,
    "availabilitySchedule": {
      "monday": ["09:00-17:00"],
      "tuesday": ["09:00-17:00"],
      "weekends": ["10:00-16:00"]
    },
    "condition": "Excellent",
    "tags": ["cordless", "versatile", "professional"],
    "includedAccessories": ["Battery charger", "Carrying case", "10 drill bits"],
    "instructions": "Please return clean and in working condition",
    "viewCount": 45,
    "borrowCount": 8,
    "averageRating": 4.7,
    "totalReviews": 6,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-10T15:30:00Z",
    "isVerified": true,
    "isFeatured": false
  }
}
```

#### PUT `/items/{itemId}`
Update item details (owner only).

#### DELETE `/items/{itemId}`
Delete item listing (owner only).

#### GET `/items/my`
Get current user's items.

**Query Parameters:**
- `status` (string): Filter by status (available, borrowed, all)
- `page` (int): Page number
- `limit` (int): Items per page

### 4. Transactions API (`/transactions`)

#### GET `/transactions`
Get user's transaction history.

**Query Parameters:**
- `type` (string): Filter by type (lending, borrowing)
- `status` (string): Filter by status (requested, accepted, completed, cancelled)
- `page` (int): Page number
- `limit` (int): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "transaction123",
        "itemId": "item123",
        "borrowerId": "user456",
        "lenderId": "user123",
        "item": {
          "id": "item123",
          "title": "Power Drill Set",
          "imageUrls": ["https://storage.googleapis.com/item_images/item123_1.jpg"]
        },
        "borrower": {
          "id": "user456",
          "displayName": "Jane Smith",
          "profileImageUrl": "https://storage.googleapis.com/profile_images/user456.jpg"
        },
        "lender": {
          "id": "user123",
          "displayName": "John Doe",
          "profileImageUrl": "https://storage.googleapis.com/profile_images/user123.jpg"
        },
        "startDate": "2024-01-15T09:00:00Z",
        "endDate": "2024-01-17T17:00:00Z",
        "status": "accepted",
        "createdAt": "2024-01-10T14:30:00Z",
        "updatedAt": "2024-01-11T09:15:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

#### POST `/transactions`
Create a borrow request.

**Request Body:**
```json
{
  "itemId": "item123",
  "startDate": "2024-01-15T09:00:00Z",
  "endDate": "2024-01-17T17:00:00Z",
  "message": "Need this for weekend DIY project"
}
```

#### GET `/transactions/{transactionId}`
Get transaction details by ID.

#### PUT `/transactions/{transactionId}/status`
Update transaction status.

**Request Body:**
```json
{
  "status": "accepted",
  "message": "Available for the requested dates"
}
```

**Status Options:**
- `accepted` (lender only)
- `rejected` (lender only)
- `cancelled` (borrower or lender)
- `completed` (both parties)

### 5. Messages API (`/messages`)

#### GET `/messages/conversations`
Get user's message conversations.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conversation123",
        "transactionId": "transaction123",
        "otherUser": {
          "id": "user456",
          "displayName": "Jane Smith",
          "profileImageUrl": "https://storage.googleapis.com/profile_images/user456.jpg"
        },
        "lastMessage": {
          "id": "message123",
          "senderId": "user456",
          "text": "Thanks for lending the drill!",
          "createdAt": "2024-01-17T18:30:00Z"
        },
        "unreadCount": 2,
        "updatedAt": "2024-01-17T18:30:00Z"
      }
    ]
  }
}
```

#### GET `/messages/conversation/{conversationId}`
Get messages in a conversation.

**Query Parameters:**
- `page` (int): Page number
- `limit` (int): Messages per page

#### POST `/messages`
Send a new message.

**Request Body:**
```json
{
  "conversationId": "conversation123",
  "text": "Thanks for lending the drill!"
}
```

#### PUT `/messages/{messageId}/read`
Mark message as read.

### 6. Reviews API (`/reviews`)

#### GET `/reviews/item/{itemId}`
Get reviews for an item.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review123",
        "transactionId": "transaction123",
        "reviewer": {
          "id": "user456",
          "displayName": "Jane Smith",
          "profileImageUrl": "https://storage.googleapis.com/profile_images/user456.jpg"
        },
        "reviewee": {
          "id": "user123",
          "displayName": "John Doe"
        },
        "rating": 5,
        "comment": "Great drill, worked perfectly!",
        "createdAt": "2024-01-18T10:00:00Z"
      }
    ],
    "summary": {
      "averageRating": 4.7,
      "totalReviews": 6,
      "ratingDistribution": {
        "5": 4,
        "4": 1,
        "3": 1,
        "2": 0,
        "1": 0
      }
    }
  }
}
```

#### GET `/reviews/user/{userId}`
Get reviews for a user.

#### POST `/reviews`
Create a new review.

**Request Body:**
```json
{
  "transactionId": "transaction123",
  "revieweeId": "user123",
  "rating": 5,
  "comment": "Great drill, worked perfectly!"
}
```

### 7. Token Management API (Java Service)

#### GET `/balance`
Get user's token balance.

**Headers:**
```
Authorization: Bearer <jwt_token>
X-API-Key: <api_key>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "balance": 5,
    "availableBalance": 5,
    "frozenBalance": 0,
    "totalEarned": 12,
    "totalSpent": 7,
    "lastUpdated": "2024-01-17T18:30:00Z"
  }
}
```

#### POST `/transaction`
Process a token transaction.

**Request Body:**
```json
{
  "userId": "user123",
  "amount": 1,
  "transactionType": "BORROW",
  "referenceId": "transaction123",
  "description": "Token deduction for borrowing Power Drill"
}
```

#### GET `/history`
Get token transaction history.

**Query Parameters:**
- `userId` (string): User ID
- `type` (string): Transaction type filter
- `page` (int): Page number
- `limit` (int): Items per page

#### POST `/validate`
Validate token balance for transaction.

**Request Body:**
```json
{
  "userId": "user123",
  "amount": 1,
  "transactionType": "BORROW"
}
```

#### POST `/freeze`
Freeze tokens for a transaction.

**Request Body:**
```json
{
  "userId": "user123",
  "amount": 1,
  "transactionId": "transaction123"
}
```

#### POST `/unfreeze`
Unfreeze tokens.

**Request Body:**
```json
{
  "userId": "user123",
  "amount": 1,
  "transactionId": "transaction123"
}
```

### 8. Search API (`/search`)

#### GET `/search/items`
Advanced item search.

**Query Parameters:**
- `q` (string): Search query
- `category` (string): Category filter
- `location` (string): Location filter
- `radius` (float): Search radius in km
- `condition` (string): Condition filter
- `minRating` (float): Minimum rating filter
- `priceRange` (string): Price range filter
- `availability` (string): Availability filter
- `sort` (string): Sort option
- `page` (int): Page number
- `limit` (int): Results per page

#### GET `/search/users`
Search users by name or location.

#### GET `/search/suggestions`
Get search suggestions.

**Query Parameters:**
- `q` (string): Partial search query
- `type` (string): Suggestion type (items, categories, users)

### 9. Location API (`/location`)

#### GET `/location/nearby`
Get items near user's location.

**Query Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude
- `radius` (float): Search radius in km
- `category` (string): Category filter

#### GET `/location/distance`
Calculate distance between two locations.

**Query Parameters:**
- `lat1` (float): First latitude
- `lng1` (float): First longitude
- `lat2` (float): Second latitude
- `lng2` (float): Second longitude

#### GET `/location/geocode`
Convert address to coordinates.

**Query Parameters:**
- `address` (string): Address to geocode

#### GET `/location/reverse-geocode`
Convert coordinates to address.

**Query Parameters:**
- `lat` (float): Latitude
- `lng` (float): Longitude

### 10. Notifications API (`/notifications`)

#### GET `/notifications`
Get user notifications.

**Query Parameters:**
- `type` (string): Notification type filter
- `read` (boolean): Read status filter
- `page` (int): Page number
- `limit` (int): Items per page

#### PUT `/notifications/{notificationId}/read`
Mark notification as read.

#### PUT `/notifications/read-all`
Mark all notifications as read.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Access denied
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict
- `RATE_LIMITED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error
- `SERVICE_UNAVAILABLE` (503): Service temporarily unavailable

## Rate Limiting

- **General API**: 60 requests per minute per user
- **Search API**: 30 requests per minute per user
- **Token API**: 20 requests per minute per user
- **Upload API**: 10 requests per minute per user

## Webhooks

### Transaction Status Updates

**Endpoint**: Your webhook URL
**Method**: POST
**Headers**:
```
X-ToolShare-Signature: <hmac_signature>
X-ToolShare-Timestamp: <unix_timestamp>
```

**Payload**:
```json
{
  "event": "transaction.status_changed",
  "data": {
    "transactionId": "transaction123",
    "oldStatus": "requested",
    "newStatus": "accepted",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## SDKs and Libraries

### Flutter SDK
```dart
dependencies:
  toolshare_flutter_sdk: ^1.0.0
```

### Python SDK
```python
pip install toolshare-python-sdk
```

### Java SDK
```xml
<dependency>
    <groupId>com.toolshare</groupId>
    <artifactId>toolshare-java-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Testing

### Test Environment
- **Base URL**: `https://api-staging.toolshare.app`
- **Test Users**: Available in developer dashboard

### API Testing Tools
- Postman collection available
- OpenAPI specification at `/docs`
- Swagger UI at `/swagger`

## Support

For API support:
- Documentation: https://docs.toolshare.app
- Email: api-support@toolshare.app
- Status Page: https://status.toolshare.app