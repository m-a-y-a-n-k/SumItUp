# 🚀 SumItUp Backend API Documentation

## 📋 **Overview**

The SumItUp backend exposes a comprehensive REST API for content summarization, user management, file handling, and more. All APIs are secured with JWT authentication where required and include proper validation and rate limiting.

**Base URL**: `http://localhost:3000/api`

## 🔐 **Authentication**

Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## 🛡️ **Global Security Features**

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Cross-origin resource sharing enabled
- **Helmet**: Security headers applied
- **Input Validation**: Express-validator for all inputs
- **Error Handling**: Centralized error handling middleware

---

## 📚 **API Endpoints**

### 🔑 **1. Authentication APIs (`/api/auth`)**

#### **User Registration & Login**

| Method | Endpoint | Description | Auth Required | Rate Limit |
|--------|----------|-------------|---------------|------------|
| `POST` | `/api/auth/signup` | Register new user | ❌ | 5/15min |
| `POST` | `/api/auth/login` | User login | ❌ | 5/15min |
| `POST` | `/api/auth/logout` | User logout | ✅ | - |

**Signup Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **Password Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/forgot-password` | Request password reset | ❌ |
| `POST` | `/api/auth/reset-password` | Reset password with token | ❌ |

#### **Email Verification**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/send-verification-email` | Send verification email | ❌ |
| `GET` | `/api/auth/verify-email` | Verify email with token | ❌ |

---

### 📝 **2. Content Summarization APIs (`/api/summary`)**

All summary endpoints require `POST` method and return generated summaries.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/summary/generate/audio` | Generate summary from audio | ❌ |
| `POST` | `/api/summary/generate/image` | Generate summary from image | ❌ |
| `POST` | `/api/summary/generate/video` | Generate summary from video | ❌ |
| `POST` | `/api/summary/generate/gif` | Generate summary from GIF | ❌ |
| `POST` | `/api/summary/generate/url` | Generate summary from URL | ❌ |
| `POST` | `/api/summary/generate/book` | Generate book summary | ❌ |
| `POST` | `/api/summary/generate/pdf` | Generate summary from PDF | ❌ |

#### **Audio Summary Request:**
```json
{
  "audioData": {
    "audioFileName": "speech.mp3",
    "format": "mp3"
  }
}
```

#### **Image Summary Request:**
```json
{
  "imageData": "base64_encoded_image_data"
}
```

#### **URL Summary Request:**
```json
{
  "url": "https://example.com/article"
}
```

#### **PDF Summary Request:**
```json
{
  "pdfData": {
    "pdfUrl": "https://example.com/document.pdf",
    "pdfText": "extracted text content (optional)"
  }
}
```

#### **Summary Response:**
```json
{
  "summary": "Generated summary text...",
  "message": "Additional processing information (optional)"
}
```

---

### 🪙 **3. Token Management APIs (`/api/token`)**

| Method | Endpoint | Description | Auth Required | Rate Limit |
|--------|----------|-------------|---------------|------------|
| `POST` | `/api/token/earn` | Earn tokens by watching ads | ✅ | 5/15min |
| `POST` | `/api/token/spend` | Spend tokens to opt out of ads | ✅ | - |

#### **Earn Tokens Request:**
```json
{
  "adId": "ad_12345"
}
```

#### **Spend Tokens Request:**
```json
{
  "tokens": 50
}
```

#### **Token Response:**
```json
{
  "message": "Tokens earned successfully",
  "tokens": 150
}
```

---

### 📊 **4. Content Management APIs (`/api/content`)**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/content/save` | Save processed content | ✅ |
| `GET` | `/api/content/history` | Get content history | ✅ |
| `GET` | `/api/content/:contentId` | Get specific content | ✅ |
| `PUT` | `/api/content/:contentId/favorite` | Toggle favorite status | ✅ |
| `GET` | `/api/content/favorites/list` | Get favorites list | ✅ |
| `PUT` | `/api/content/:contentId/tags/add` | Add tags to content | ✅ |
| `PUT` | `/api/content/:contentId/tags/remove` | Remove tags from content | ✅ |
| `DELETE` | `/api/content/:contentId` | Delete content | ✅ |
| `GET` | `/api/content/search/tags` | Search by tags | ✅ |

#### **Save Content Request:**
```json
{
  "title": "My Article Summary",
  "originalContent": "Original article text...",
  "summary": "Generated summary...",
  "contentType": "text",
  "metadata": {
    "processingTime": 1500,
    "confidence": 0.95,
    "wordCount": 250
  },
  "tags": ["technology", "ai"]
}
```

#### **Content History Response:**
```json
{
  "contents": [
    {
      "id": "content_123",
      "title": "Article Summary",
      "summary": "Brief summary...",
      "contentType": "text",
      "tags": ["tech"],
      "isFavorite": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### **Query Parameters for History/Favorites:**
- `limit`: Number of items (1-100, default: 10)
- `offset`: Starting position (default: 0)
- `contentType`: Filter by type (audio, image, video, etc.)
- `isFavorite`: Filter favorites (true/false)

---

### 📁 **5. File Management APIs (`/api/files`)**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/files/upload` | Upload file | ✅ |
| `GET` | `/api/files/download/:fileId` | Download file | ❌ |
| `DELETE` | `/api/files/:fileId` | Delete file | ✅ |
| `GET` | `/api/files/list` | List user files | ✅ |

#### **File Upload:**
- **Content-Type**: `multipart/form-data`
- **Field Name**: `file`
- **Max Size**: 10MB
- **Supported Types**: JPEG, PNG, GIF, MP3, WAV, PDF, TXT

#### **Upload Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "id": "file_123",
    "originalName": "document.pdf",
    "filename": "abc123.pdf",
    "size": 1024000,
    "type": "application/pdf",
    "uploadedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 👤 **6. User Preferences APIs (`/api/user`)**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/user/preferences` | Get user preferences | ✅ |
| `PUT` | `/api/user/preferences` | Update preferences | ✅ |
| `POST` | `/api/user/preferences/reset` | Reset to defaults | ✅ |
| `POST` | `/api/user/preferences/interests` | Add interests | ✅ |
| `DELETE` | `/api/user/preferences/interests` | Remove interests | ✅ |

#### **Preferences Structure:**
```json
{
  "preferences": {
    "defaultSummaryLength": "medium",
    "summaryStyle": "paragraph",
    "preferredLanguage": "en",
    "processingQuality": "balanced",
    "autoSaveContent": true,
    "defaultPrivacy": "private",
    "emailNotifications": true,
    "processingNotifications": true,
    "weeklyDigest": false,
    "theme": "auto",
    "itemsPerPage": 10,
    "favoriteContentTypes": ["text", "audio"],
    "interests": ["technology", "science"]
  }
}
```

#### **Update Preferences Request:**
```json
{
  "defaultSummaryLength": "long",
  "theme": "dark",
  "emailNotifications": false
}
```

---

### 🔍 **7. Search APIs (`/api/search`)**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/search/fuzzy` | Fuzzy search content | ❌ |
| `GET` | `/api/search/books` | Search books | ❌ |

#### **Fuzzy Search Query Parameters:**
- `query`: Search term (required)
- `type`: Content type filter (all, book, article, video)
- `limit`: Result limit (default: 10)

#### **Book Search Query Parameters:**
- `title`: Book title
- `author`: Author name
- `genre`: Book genre
- `limit`: Result limit (default: 10)

#### **Search Response:**
```json
{
  "query": "javascript",
  "type": "all",
  "results": [
    {
      "id": "1",
      "title": "JavaScript Guide",
      "type": "book",
      "summary": "Comprehensive JavaScript guide...",
      "relevanceScore": 0.95
    }
  ],
  "totalFound": 3,
  "message": "Search completed successfully"
}
```

---

### 📄 **8. PDF Generation APIs (`/api/pdf`)**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/pdf/generate` | Generate PDF from summary | ❌ |

---

### 📺 **9. Advertisement APIs (`/api/ad`)**

| Method | Endpoint | Description | Auth Required | Rate Limit |
|--------|----------|-------------|---------------|------------|
| `GET` | `/api/ad/check-eligibility` | Check ad eligibility | ✅ | 10/15min |

---

### 📖 **10. API Documentation (`/api/docs`)**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/docs` | Swagger API documentation | ❌ |

---

## 📝 **Request/Response Formats**

### **Standard Success Response:**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### **Standard Error Response:**
```json
{
  "error": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### **HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## 🔧 **Validation Rules**

### **User Registration:**
- Username: Required, string
- Email: Required, valid email format
- Password: Required, alphanumeric, minimum 8 characters

### **Content Saving:**
- Title: 1-200 characters
- Original Content: Required, non-empty
- Summary: Required, non-empty
- Content Type: Must be one of: audio, image, video, gif, url, pdf, book, text
- Tags: Optional array of strings

### **File Upload:**
- File size: Maximum 10MB
- File types: JPEG, PNG, GIF, MP3, WAV, PDF, TXT only

### **Pagination:**
- Limit: 1-100 (default: 10)
- Offset: Non-negative integer (default: 0)

---

## 🚀 **Usage Examples**

### **Complete User Flow:**

1. **Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

3. **Generate Summary:**
```bash
curl -X POST http://localhost:3000/api/summary/generate/url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/article"}'
```

4. **Save Content:**
```bash
curl -X POST http://localhost:3000/api/content/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Article","originalContent":"...","summary":"...","contentType":"text"}'
```

5. **Get History:**
```bash
curl -X GET "http://localhost:3000/api/content/history?limit=5" \
  -H "Authorization: Bearer <token>"
```

---

## 🔒 **Security Considerations**

1. **Authentication**: JWT tokens expire in 1 hour
2. **Rate Limiting**: Different limits for different endpoints
3. **Input Validation**: All inputs are validated and sanitized
4. **File Security**: File type and size restrictions
5. **CORS**: Configured for cross-origin requests
6. **Headers**: Security headers via Helmet middleware

---

## 🐛 **Error Handling**

The API includes comprehensive error handling:

- **Validation Errors**: Detailed field-level validation messages
- **Authentication Errors**: Clear authentication failure messages
- **Rate Limit Errors**: Informative rate limit exceeded messages
- **File Errors**: Specific file upload/processing error messages
- **Database Errors**: Graceful handling of database connection issues

---

## 📈 **Performance Features**

1. **Caching**: NodeCache for user data (15-minute TTL)
2. **Rate Limiting**: Prevents API abuse
3. **Pagination**: Efficient data retrieval
4. **File Streaming**: Efficient file download
5. **Input Validation**: Early request validation

This comprehensive API provides all the functionality needed for a full-featured content summarization platform with user management, file handling, and personalization capabilities.
