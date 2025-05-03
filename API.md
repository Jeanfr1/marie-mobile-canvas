# Gift Tracker API Documentation

Base URL: `https://buaes967sk.execute-api.us-east-1.amazonaws.com/prod`

## Authentication

All endpoints require authentication using Amazon Cognito. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Users

#### GET /users

Retrieves the current user's profile.

**Request:**

- Method: GET
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  ```

**Response:**

```json
{
  "userId": "string",
  "name": "string",
  "email": "string",
  "preferences": {
    "notifications": boolean,
    "theme": "string"
  }
}
```

#### PUT /users

Updates the current user's profile.

**Request:**

- Method: PUT
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- Body:
  ```json
  {
    "name": "string",
    "email": "string",
    "preferences": {
      "notifications": boolean,
      "theme": "string"
    }
  }
  ```

**Response:**

```json
{
  "userId": "string",
  "name": "string",
  "email": "string",
  "preferences": {
    "notifications": boolean,
    "theme": "string"
  }
}
```

### Gifts

#### GET /gifts

Retrieves all gifts for the current user.

**Request:**

- Method: GET
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  ```
- Query Parameters:
  - `type`: "given" | "received" (optional)
  - `contactId`: string (optional)
  - `eventId`: string (optional)

**Response:**

```json
{
  "items": [
    {
      "giftId": "string",
      "name": "string",
      "description": "string",
      "type": "given" | "received",
      "date": "ISO-8601 string",
      "contactId": "string",
      "eventId": "string",
      "imageUrl": "string",
      "tags": ["string"],
      "notes": "string"
    }
  ]
}
```

#### POST /gifts

Creates a new gift record.

**Request:**

- Method: POST
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- Body:
  ```json
  {
    "name": "string",
    "description": "string",
    "type": "given" | "received",
    "date": "ISO-8601 string",
    "contactId": "string",
    "eventId": "string",
    "imageUrl": "string",
    "tags": ["string"],
    "notes": "string"
  }
  ```

**Response:**

```json
{
  "giftId": "string",
  "name": "string",
  "description": "string",
  "type": "given" | "received",
  "date": "ISO-8601 string",
  "contactId": "string",
  "eventId": "string",
  "imageUrl": "string",
  "tags": ["string"],
  "notes": "string"
}
```

#### PUT /gifts/{giftId}

Updates an existing gift record.

**Request:**

- Method: PUT
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- Path Parameters:
  - `giftId`: string
- Body:
  ```json
  {
    "name": "string",
    "description": "string",
    "type": "given" | "received",
    "date": "ISO-8601 string",
    "contactId": "string",
    "eventId": "string",
    "imageUrl": "string",
    "tags": ["string"],
    "notes": "string"
  }
  ```

**Response:**

```json
{
  "giftId": "string",
  "name": "string",
  "description": "string",
  "type": "given" | "received",
  "date": "ISO-8601 string",
  "contactId": "string",
  "eventId": "string",
  "imageUrl": "string",
  "tags": ["string"],
  "notes": "string"
}
```

#### DELETE /gifts/{giftId}

Deletes a gift record.

**Request:**

- Method: DELETE
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  ```
- Path Parameters:
  - `giftId`: string

**Response:**

```json
{
  "success": true,
  "message": "Gift deleted successfully"
}
```

### Contacts

#### GET /contacts

Retrieves all contacts for the current user.

**Request:**

- Method: GET
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  ```

**Response:**

```json
{
  "items": [
    {
      "contactId": "string",
      "name": "string",
      "email": "string",
      "relationship": "string",
      "notes": "string",
      "important_dates": [
        {
          "date": "ISO-8601 string",
          "occasion": "string"
        }
      ]
    }
  ]
}
```

#### POST /contacts

Creates a new contact.

**Request:**

- Method: POST
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- Body:
  ```json
  {
    "name": "string",
    "email": "string",
    "relationship": "string",
    "notes": "string",
    "important_dates": [
      {
        "date": "ISO-8601 string",
        "occasion": "string"
      }
    ]
  }
  ```

**Response:**

```json
{
  "contactId": "string",
  "name": "string",
  "email": "string",
  "relationship": "string",
  "notes": "string",
  "important_dates": [
    {
      "date": "ISO-8601 string",
      "occasion": "string"
    }
  ]
}
```

### Events

#### GET /events

Retrieves all events for the current user.

**Request:**

- Method: GET
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  ```
- Query Parameters:
  - `startDate`: ISO-8601 string (optional)
  - `endDate`: ISO-8601 string (optional)

**Response:**

```json
{
  "items": [
    {
      "eventId": "string",
      "name": "string",
      "date": "ISO-8601 string",
      "type": "string",
      "contactIds": ["string"],
      "notes": "string",
      "reminder": {
        "enabled": boolean,
        "daysBeforeEvent": number
      }
    }
  ]
}
```

#### POST /events

Creates a new event.

**Request:**

- Method: POST
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- Body:
  ```json
  {
    "name": "string",
    "date": "ISO-8601 string",
    "type": "string",
    "contactIds": ["string"],
    "notes": "string",
    "reminder": {
      "enabled": boolean,
      "daysBeforeEvent": number
    }
  }
  ```

**Response:**

```json
{
  "eventId": "string",
  "name": "string",
  "date": "ISO-8601 string",
  "type": "string",
  "contactIds": ["string"],
  "notes": "string",
  "reminder": {
    "enabled": boolean,
    "daysBeforeEvent": number
  }
}
```

### Images

#### POST /images/upload-url

Generates a pre-signed URL for uploading an image to S3.

**Request:**

- Method: POST
- Authentication: Required
- Headers:
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- Body:
  ```json
  {
    "contentType": "string", // e.g., "image/jpeg"
    "filename": "string"
  }
  ```

**Response:**

```json
{
  "uploadUrl": "string", // Pre-signed S3 URL
  "imageUrl": "string",  // Public URL of the image after upload
  "expiresIn": number   // Seconds until the upload URL expires
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Invalid request parameters",
  "details": "Description of the error"
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication required",
  "details": "Invalid or missing token"
}
```

### 403 Forbidden

```json
{
  "message": "Access denied",
  "details": "You don't have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found",
  "details": "The requested resource does not exist"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error",
  "details": "An unexpected error occurred"
}
```

## Rate Limits

- Default rate limit: 1000 requests per minute per user
- Image upload URL generation: 100 requests per minute per user

## CORS

All endpoints support CORS with the following headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token
```
