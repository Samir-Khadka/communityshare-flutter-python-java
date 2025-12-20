# Database Schemas for ToolShare Platform

## Overview

The ToolShare platform uses multiple database systems optimized for different purposes:

1. **Firebase Firestore** - Primary database for real-time data
2. **PostgreSQL** - Python backend relational data
3. **Redis** - Caching and session management
4. **H2/PostgreSQL** - Java token system

## 1. Firebase Firestore Schema

### Collections Structure

#### Users Collection
```javascript
{
  "userId": "string",           // Primary key
  "email": "string",            // User email (unique)
  "displayName": "string",       // Display name
  "locationCity": "string",      // City
  "locationPostcode": "string", // Postal code
  "location": {                 // Geopoint for location queries
    "latitude": number,
    "longitude": number
  },
  "bio": "string",              // Optional bio
  "profileImageUrl": "string",   // Profile image URL
  "phoneNumber": "string",       // Optional phone number
  "isEmailVerified": boolean,    // Email verification status
  "isActive": boolean,          // Account status
  "trustTokenBalance": number,   // Current token balance
  "averageRating": number,       // Average rating (0-5)
  "totalLendingCount": number,  // Total items lent
  "totalBorrowingCount": number, // Total items borrowed
  "favoriteCategories": ["string"], // Favorite tool categories
  "isAvailableForLending": boolean, // Willingness to lend items
  "pushNotificationsEnabled": boolean, // Push notification preference
  "emailNotificationsEnabled": boolean, // Email notification preference
  "createdAt": "timestamp",     // Account creation time
  "updatedAt": "timestamp",     // Last update time
  "lastLoginAt": "timestamp",   // Last login time
  "fcmToken": "string",        // Firebase Cloud Messaging token
  "verificationCode": "string",  // Email verification code
  "resetPasswordCode": "string", // Password reset code
  "resetPasswordExpires": "timestamp" // Reset code expiration
}
```

#### Items Collection
```javascript
{
  "itemId": "string",           // Primary key
  "ownerId": "string",         // Owner user ID
  "title": "string",           // Item title
  "description": "string",      // Detailed description
  "category": "string",        // Tool category
  "imageUrls": ["string"],     // Array of image URLs
  "locationCity": "string",    // Item location city
  "locationPostcode": "string", // Item location postcode
  "location": {                // Geopoint for location queries
    "latitude": number,
    "longitude": number
  },
  "isAvailable": boolean,       // Availability status
  "availabilitySchedule": {     // Weekly availability schedule
    "monday": ["09:00-17:00", "18:00-20:00"],
    "tuesday": ["09:00-17:00"],
    "wednesday": ["09:00-17:00"],
    "thursday": ["09:00-17:00"],
    "friday": ["09:00-17:00"],
    "saturday": ["10:00-16:00"],
    "sunday": ["10:00-16:00"],
    "exceptions": [            // Date exceptions
      {
        "date": "2024-12-25",
        "available": false,
        "reason": "Christmas holiday"
      }
    ]
  },
  "condition": "string",       // Item condition (New, Excellent, Good, Fair)
  "tags": ["string"],         // Search tags
  "includedAccessories": ["string"], // Included accessories
  "instructions": "string",   // Usage instructions
  "safetyNotes": "string",    // Safety warnings
  "viewCount": number,         // Number of views
  "borrowCount": number,       // Number of times borrowed
  "averageRating": number,      // Average rating
  "totalReviews": number,       // Total number of reviews
  "isVerified": boolean,        // Verification status
  "isFeatured": boolean,        // Featured status
  "createdAt": "timestamp",     // Creation time
  "updatedAt": "timestamp",     // Last update time
  "lastBorrowedAt": "timestamp", // Last borrow time
  "expiryDate": "timestamp",    // Listing expiry (optional)
  "status": "string"          // active, inactive, suspended
}
```

#### Transactions Collection
```javascript
{
  "transactionId": "string",    // Primary key
  "itemId": "string",          // Item ID
  "borrowerId": "string",      // Borrower user ID
  "lenderId": "string",        // Lender user ID
  "startDate": "timestamp",     // Borrow start date
  "endDate": "timestamp",       // Borrow end date
  "actualReturnDate": "timestamp", // Actual return date
  "status": "string",          // requested, accepted, rejected, cancelled, completed
  "borrowRequestMessage": "string", // Initial request message
  "lenderResponseMessage": "string", // Lender's response
  "cancellationReason": "string", // Cancellation reason
  "heldTokenAmount": number,    // Tokens held in escrow
  "tokenReleased": boolean,      // Whether tokens were released
  "createdAt": "timestamp",     // Transaction creation time
  "updatedAt": "timestamp",     // Last update time
  "acceptedAt": "timestamp",    // Acceptance time
  "completedAt": "timestamp",   // Completion time
  "cancelledAt": "timestamp",   // Cancellation time
  "reviewSubmitted": boolean,    // Whether review was submitted
  "borrowerReviewed": boolean,   // Borrower review status
  "lenderReviewed": boolean,     // Lender review status
  "pickupLocation": "string",     // Pickup location details
  "returnLocation": "string",      // Return location details
  "specialInstructions": "string",  // Special instructions
  "damageReport": "string",       // Damage report (if any)
  "lateReturn": boolean,          // Whether return was late
  "extensionRequested": boolean,    // Extension request status
  "extensionApproved": boolean      // Extension approval status
}
```

#### Messages Collection
```javascript
{
  "messageId": "string",       // Primary key
  "transactionId": "string",   // Associated transaction ID
  "conversationId": "string",  // Conversation ID (transactionId or custom)
  "senderId": "string",        // Sender user ID
  "receiverId": "string",      // Receiver user ID
  "text": "string",            // Message content
  "messageType": "string",      // text, image, location, system
  "imageUrl": "string",         // Image URL (if image message)
  "location": {                 // Location data (if location message)
    "latitude": number,
    "longitude": number,
    "address": "string"
  },
  "isRead": boolean,           // Read status
  "readAt": "timestamp",       // Read timestamp
  "createdAt": "timestamp",     // Message creation time
  "updatedAt": "timestamp",     // Last update time
  "isEdited": boolean,         // Edit status
  "editedAt": "timestamp",     // Edit timestamp
  "isDeleted": boolean,        // Delete status
  "deletedAt": "timestamp",     // Delete timestamp
  "replyToMessageId": "string", // Reply to message ID
  "attachments": [             // File attachments
    {
      "type": "string",        // image, document, video
      "url": "string",
      "filename": "string",
      "size": number
    }
  ]
}
```

#### Reviews Collection
```javascript
{
  "reviewId": "string",        // Primary key
  "transactionId": "string",   // Associated transaction ID
  "itemId": "string",         // Reviewed item ID
  "reviewerId": "string",     // Reviewer user ID
  "revieweeId": "string",     // Reviewee user ID
  "rating": number,            // Rating (1-5)
  "comment": "string",         // Review comment
  "categoryRatings": {         // Category-specific ratings
    "itemCondition": number,
    "communication": number,
    "timeliness": number,
    "overall": number
  },
  "wouldRecommend": boolean,     // Would recommend
  "publicResponse": "string",   // Public response from reviewee
  "isVerified": boolean,        // Verified purchase/lending
  "helpfulCount": number,       // Helpful votes
  "createdAt": "timestamp",     // Review creation time
  "updatedAt": "timestamp",     // Last update time
  "reported": boolean,          // Reported status
  "reportReason": "string",     // Report reason
  "moderated": boolean,        // Moderation status
  "moderationNote": "string"    // Moderation notes
}
```

#### Notifications Collection
```javascript
{
  "notificationId": "string",   // Primary key
  "userId": "string",          // Target user ID
  "type": "string",            // Notification type
  "title": "string",           // Notification title
  "body": "string",            // Notification body
  "data": {                   // Additional data
    "transactionId": "string",
    "itemId": "string",
    "senderId": "string",
    "actionUrl": "string"
  },
  "isRead": boolean,           // Read status
  "readAt": "timestamp",       // Read timestamp
  "createdAt": "timestamp",     // Creation time
  "expiresAt": "timestamp",    // Expiration time
  "priority": "string",        // Priority level
  "channels": ["string"],      // Delivery channels
  "delivered": boolean,        // Delivery status
  "deliveredAt": "timestamp",  // Delivery timestamp
  "clickCount": number,        // Click count
  "dismissed": boolean,       // Dismissed status
  "dismissedAt": "timestamp"  // Dismissal timestamp
}
```

## 2. PostgreSQL Schema (Python Backend)

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_postcode VARCHAR(20) NOT NULL,
    bio TEXT,
    profile_image_url VARCHAR(500),
    phone_number VARCHAR(20),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    trust_token_balance INTEGER DEFAULT 5,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_lending_count INTEGER DEFAULT 0,
    total_borrowing_count INTEGER DEFAULT 0,
    favorite_categories TEXT[],
    is_available_for_lending BOOLEAN DEFAULT TRUE,
    push_notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(location_city, location_postcode);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
```

### Items Table
```sql
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    location_city VARCHAR(100) NOT NULL,
    location_postcode VARCHAR(20) NOT NULL,
    location POINT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    availability_schedule JSONB DEFAULT '{}',
    condition VARCHAR(20) DEFAULT 'Good',
    tags TEXT[] DEFAULT '{}',
    included_accessories TEXT[] DEFAULT '{}',
    instructions TEXT,
    safety_notes TEXT,
    view_count INTEGER DEFAULT 0,
    borrow_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_borrowed_at TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE INDEX idx_items_owner_id ON items(owner_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_location ON items USING GIST(location);
CREATE INDEX idx_items_available ON items(is_available);
CREATE INDEX idx_items_created_at ON items(created_at DESC);
CREATE INDEX idx_items_rating ON items(average_rating DESC);
CREATE INDEX idx_items_tags ON items USING GIN(tags);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'requested',
    borrow_request_message TEXT,
    lender_response_message TEXT,
    cancellation_reason TEXT,
    held_token_amount INTEGER DEFAULT 0,
    token_released BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    review_submitted BOOLEAN DEFAULT FALSE,
    borrower_reviewed BOOLEAN DEFAULT FALSE,
    lender_reviewed BOOLEAN DEFAULT FALSE,
    pickup_location TEXT,
    return_location TEXT,
    special_instructions TEXT,
    damage_report TEXT,
    late_return BOOLEAN DEFAULT FALSE,
    extension_requested BOOLEAN DEFAULT FALSE,
    extension_approved BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_transactions_item_id ON transactions(item_id);
CREATE INDEX idx_transactions_borrower_id ON transactions(borrower_id);
CREATE INDEX idx_transactions_lender_id ON transactions(lender_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_dates ON transactions(start_date, end_date);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
```

### Messages Table
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    conversation_id VARCHAR(100) NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    image_url VARCHAR(500),
    location POINT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    reply_to_message_id UUID REFERENCES messages(id),
    attachments JSONB DEFAULT '[]'
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    category_ratings JSONB DEFAULT '{}',
    would_recommend BOOLEAN,
    public_response TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reported BOOLEAN DEFAULT FALSE,
    report_reason TEXT,
    moderated BOOLEAN DEFAULT FALSE,
    moderation_note TEXT
);

CREATE INDEX idx_reviews_transaction_id ON reviews(transaction_id);
CREATE INDEX idx_reviews_item_id ON reviews(item_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE UNIQUE INDEX idx_reviews_unique ON reviews(transaction_id, reviewer_id);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(20) DEFAULT 'normal',
    channels TEXT[] DEFAULT '{"push", "email"}',
    delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    click_count INTEGER DEFAULT 0,
    dismissed BOOLEAN DEFAULT FALSE,
    dismissed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_priority ON notifications(priority);
```

## 3. Java Token System Database Schema

### Tokens Table
```sql
CREATE TABLE tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    available_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    frozen_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    last_updated TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    version BIGINT DEFAULT 0
);

CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_tokens_balance ON tokens(balance);
CREATE INDEX idx_tokens_last_updated ON tokens(last_updated);
```

### Token Transactions Table
```sql
CREATE TABLE token_transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    reference_id VARCHAR(36),
    description TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    signature VARCHAR(512),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX idx_token_transactions_type ON token_transactions(transaction_type);
CREATE INDEX idx_token_transactions_status ON token_transactions(status);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at DESC);
CREATE INDEX idx_token_transactions_reference_id ON token_transactions(reference_id);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(36),
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL,
    severity VARCHAR(20) DEFAULT 'INFO'
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
```

### Token Distributions Table
```sql
CREATE TABLE token_distributions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    distribution_type VARCHAR(50) NOT NULL,
    reason VARCHAR(200),
    reference_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP
);

CREATE INDEX idx_token_distributions_user_id ON token_distributions(user_id);
CREATE INDEX idx_token_distributions_type ON token_distributions(distribution_type);
CREATE INDEX idx_token_distributions_created_at ON token_distributions(created_at DESC);
```

## 4. Redis Cache Schema

### Cache Keys Structure
```
user:profile:{userId}              - User profile data (TTL: 1 hour)
user:token_balance:{userId}         - Token balance (TTL: 5 minutes)
item:details:{itemId}             - Item details (TTL: 30 minutes)
search:results:{query_hash}        - Search results (TTL: 15 minutes)
notifications:{userId}            - User notifications (TTL: 10 minutes)
session:{sessionId}               - User session data (TTL: 24 hours)
rate_limit:{userId}:{endpoint}     - Rate limiting (TTL: 1 minute)
location:nearby:{lat}:{lng}      - Nearby items (TTL: 5 minutes)
```

### Data Structures
```
User Profile (Hash):
{
  "id": "user123",
  "displayName": "John Doe",
  "email": "john@example.com",
  "location": "London, UK",
  "trustTokenBalance": 5
}

Token Balance (String):
"5.00"

Search Results (List):
[
  {"id": "item1", "title": "Power Drill"},
  {"id": "item2", "title": "Garden Tools"}
]

Notifications (List):
[
  {"id": "notif1", "type": "transaction", "read": false},
  {"id": "notif2", "type": "message", "read": true}
]
```

## 5. Database Relationships

### Entity Relationship Diagram
```
Users (1) -----> (N) Items
Users (1) -----> (N) Transactions (as borrower)
Users (1) -----> (N) Transactions (as lender)
Users (1) -----> (N) Messages (as sender)
Users (1) -----> (N) Messages (as receiver)
Users (1) -----> (N) Reviews (as reviewer)
Users (1) -----> (N) Reviews (as reviewee)
Users (1) -----> (N) Notifications
Users (1) -----> (N) Tokens

Items (1) -----> (N) Transactions
Items (1) -----> (N) Reviews

Transactions (1) -----> (N) Messages
Transactions (1) -----> (N) Reviews

Messages (N) -----> (N) Messages (replies)
```

## 6. Data Migration Strategy

### Version Control
- Use database migration files with version numbers
- Track migrations in `schema_migrations` table
- Support rollback capabilities

### Migration Process
1. Backup current database
2. Apply migration in transaction
3. Verify data integrity
4. Update migration log
5. Monitor performance

## 7. Performance Optimization

### Indexing Strategy
- Primary keys automatically indexed
- Foreign keys indexed for join performance
- Composite indexes for common query patterns
- GIN indexes for array/jsonb columns

### Query Optimization
- Use appropriate indexes
- Limit result sets with pagination
- Cache frequently accessed data
- Optimize JOIN operations

### Partitioning
- Partition large tables by date
- Partition audit logs monthly
- Partition transactions quarterly

## 8. Security Considerations

### Data Encryption
- Encrypt sensitive data at rest
- Use TLS for data in transit
- Implement field-level encryption for PII

### Access Control
- Row-level security for user data
- Role-based access control
- Audit all data access

### Backup Strategy
- Daily automated backups
- Point-in-time recovery capability
- Cross-region backup replication
- Regular backup testing

This comprehensive database schema supports all features of the ToolShare platform while ensuring performance, scalability, and data integrity.