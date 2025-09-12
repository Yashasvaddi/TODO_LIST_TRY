# API Contract - Agricultural Dashboard Static MVP

## Base Configuration

**Base URL:** `http://localhost:8000/api/v1`  
**Authentication:** Bearer token (Mock JWT for MVP)  
**Content-Type:** `application/json`  
**API Version:** 1.0.0

## Authentication Endpoints

### POST /auth/login
**Description:** Mock login endpoint - accepts any credentials for MVP
**Method:** POST
**URL:** `/api/v1/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "any_password"
}
```

**Response (200 OK):**
```json
{
  "access_token": "mock_jwt_token_admin_example_com",
  "token_type": "bearer",
  "user": {
    "id": "mock_user_id",
    "email": "admin@example.com",
    "name": "Mock Admin User",
    "role": "admin"
  }
}
```

### POST /auth/logout
**Description:** Mock logout endpoint
**Method:** POST
**URL:** `/api/v1/auth/logout`
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

### GET /auth/me
**Description:** Get current user information
**Method:** GET
**URL:** `/api/v1/auth/me`
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "user_id": "mock_user",
  "email": "admin@example.com",
  "role": "admin"
}
```

## Farm Management Endpoints

### GET /farms
**Description:** Retrieve all farms (mock data)
**Method:** GET
**URL:** `/api/v1/farms`
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
[
  {
    "id": "farm_001",
    "name": "Green Valley Farm",
    "location": "North Region",
    "area": 145.2,
    "crop": "Wheat",
    "owner": "John Smith",
    "coordinates": "38.4575, -120.1205",
    "status": "active"
  },
  {
    "id": "farm_002",
    "name": "Sunny Acres",
    "location": "South Region",
    "area": 98.7,
    "crop": "Corn",
    "owner": "Maria Garcia",
    "coordinates": "38.4612, -120.1188",
    "status": "active"
  }
]
```

### GET /farms/{farm_id}
**Description:** Get specific farm details
**Method:** GET
**URL:** `/api/v1/farms/farm_001`
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "id": "farm_001",
  "name": "Green Valley Farm",
  "location": "North Region",
  "area": 145.2,
  "crop": "Wheat",
  "owner": "John Smith",
  "coordinates": "38.4575, -120.1205",
  "status": "active"
}
```

**Response (404 Not Found):**
```json
{
  "detail": "Farm not found"
}
```

### POST /farms
**Description:** Create new farm (mock operation)
**Method:** POST
**URL:** `/api/v1/farms`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "farm_004",
  "name": "New Farm",
  "location": "West Region",
  "area": 120.5,
  "crop": "Rice",
  "owner": "Jane Doe",
  "coordinates": "38.4500, -120.1300",
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "message": "Farm created successfully",
  "farm_id": "farm_004"
}
```

### PUT /farms/{farm_id}
**Description:** Update existing farm (mock operation)
**Method:** PUT
**URL:** `/api/v1/farms/farm_001`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "farm_001",
  "name": "Green Valley Farm Updated",
  "location": "North Region",
  "area": 150.0,
  "crop": "Wheat",
  "owner": "John Smith",
  "coordinates": "38.4575, -120.1205",
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "message": "Farm updated successfully"
}
```

### DELETE /farms/{farm_id}
**Description:** Delete farm (mock operation)
**Method:** DELETE
**URL:** `/api/v1/farms/farm_001`
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Farm deleted successfully"
}
```

## Weather Data Endpoints

### GET /weather
**Description:** Get weather data with optional filters
**Method:** GET
**URL:** `/api/v1/weather?farm_id=farm_001&start_date=2024-01-01&end_date=2024-01-31`
**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `farm_id` (optional): Filter by farm ID
- `start_date` (optional): Start date (YYYY-MM-DD)
- `end_date` (optional): End date (YYYY-MM-DD)

**Response (200 OK):**
```json
[
  {
    "id": "weather_001",
    "farmId": "farm_001",
    "date": "2024-01-15",
    "temperature": 24.5,
    "humidity": 68,
    "rainfall": 12.3,
    "windSpeed": 8.2,
    "conditions": "Partly Cloudy"
  }
]
```

### POST /weather
**Description:** Add new weather reading (mock operation)
**Method:** POST
**URL:** `/api/v1/weather`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "weather_new",
  "farmId": "farm_001",
  "date": "2024-01-16",
  "temperature": 25.2,
  "humidity": 70,
  "rainfall": 5.1,
  "windSpeed": 7.8,
  "conditions": "Clear"
}
```

**Response (200 OK):**
```json
{
  "message": "Weather data added successfully"
}
```

## Market Data Endpoints

### GET /market/prices
**Description:** Get current market prices
**Method:** GET
**URL:** `/api/v1/market/prices`
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
[
  {
    "id": "market_001",
    "commodity": "Wheat",
    "price": 285.50,
    "currency": "USD",
    "unit": "per ton",
    "change": "+2.3%",
    "market": "Chicago Board of Trade",
    "lastUpdated": "2024-01-15T14:30:00Z"
  },
  {
    "id": "market_002",
    "commodity": "Corn",
    "price": 220.75,
    "currency": "USD",
    "unit": "per ton",
    "change": "-1.2%",
    "market": "Chicago Board of Trade",
    "lastUpdated": "2024-01-15T14:30:00Z"
  }
]
```

### GET /market/trends
**Description:** Get market trends for specified period
**Method:** GET
**URL:** `/api/v1/market/trends?commodity=wheat&days=30`
**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `commodity` (optional): Specific commodity
- `days` (optional): Number of days (default: 30)

**Response (200 OK):**
```json
{
  "commodity": "wheat",
  "period_days": 30,
  "trend": "upward",
  "change_percent": 2.3,
  "data_points": [
    {"date": "2024-01-10", "price": 280.50},
    {"date": "2024-01-15", "price": 285.50}
  ]
}
```

## Alert Management Endpoints

### GET /alerts
**Description:** Get alerts with optional filters
**Method:** GET
**URL:** `/api/v1/alerts?severity=high&status=active&alert_type=weather`
**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `severity` (optional): high, medium, low
- `status` (optional): active, acknowledged, resolved
- `alert_type` (optional): weather, pest, disease, irrigation, market

**Response (200 OK):**
```json
[
  {
    "id": "alert_001",
    "type": "weather",
    "severity": "high",
    "title": "Heavy Rain Warning",
    "description": "Expected rainfall of 45mm in the next 6 hours",
    "farmId": "farm_001",
    "farmName": "Green Valley Farm",
    "timestamp": "2024-01-15T08:30:00Z",
    "status": "active",
    "affectedArea": "145.2 hectares",
    "actionRequired": "Implement drainage measures"
  }
]
```

### POST /alerts
**Description:** Create new alert (mock operation)
**Method:** POST
**URL:** `/api/v1/alerts`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "alert_new",
  "type": "pest",
  "severity": "medium",
  "title": "New Pest Alert",
  "description": "Detected unusual insect activity",
  "farmId": "farm_002",
  "farmName": "Sunny Acres",
  "timestamp": "2024-01-15T10:00:00Z",
  "status": "active",
  "affectedArea": "25.0 hectares",
  "actionRequired": "Schedule inspection"
}
```

**Response (200 OK):**
```json
{
  "message": "Alert created successfully",
  "alert_id": "alert_new"
}
```

### PUT /alerts/{alert_id}/status
**Description:** Update alert status
**Method:** PUT
**URL:** `/api/v1/alerts/alert_001/status`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "acknowledged"
}
```

**Response (200 OK):**
```json
{
  "message": "Alert status updated successfully"
}
```

### DELETE /alerts/{alert_id}
**Description:** Dismiss alert (mock operation)
**Method:** DELETE
**URL:** `/api/v1/alerts/alert_001`
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Alert dismissed successfully"
}
```

## Power BI Integration Endpoints

### GET /powerbi/reports
**Description:** Get available Power BI reports
**Method:** GET
**URL:** `/api/v1/powerbi/reports`
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
[
  {
    "id": "crop-analytics",
    "name": "Crop Analytics Dashboard",
    "embedUrl": "https://app.powerbi.com/reportEmbed?reportId=mock-crop-analytics",
    "datasetId": "crop-dataset-001",
    "status": "ready"
  },
  {
    "id": "weather-insights",
    "name": "Weather & Climate Insights",
    "embedUrl": "https://app.powerbi.com/reportEmbed?reportId=mock-weather-insights",
    "datasetId": "weather-dataset-001",
    "status": "ready"
  }
]
```

### POST /powerbi/push ⚠️ CRITICAL ENDPOINT
**Description:** Push data to Power BI (Mock - logs data and returns success)
**Method:** POST
**URL:** `/api/v1/powerbi/push`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "datasetId": "crop-dataset-001",
  "tableName": "FarmData",
  "rows": [
    {
      "FarmID": "farm_001",
      "FarmName": "Green Valley Farm",
      "Location": "North Region",
      "AreaHectares": 145.2,
      "CropType": "Wheat",
      "Owner": "John Smith",
      "Latitude": 38.4575,
      "Longitude": -120.1205,
      "Status": "active",
      "LastUpdated": "2024-01-15T14:30:00Z"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Data push to Power BI simulated successfully",
  "datasetId": "crop-dataset-001",
  "tableName": "FarmData",
  "rowCount": 1,
  "status": "mock_success"
}
```

**Note:** This endpoint currently logs the data that would be pushed to Power BI and returns a success response. In production, this will make actual API calls to Power BI's PostRows endpoint.

### POST /powerbi/refresh/{dataset_id}
**Description:** Trigger Power BI dataset refresh (mock operation)
**Method:** POST
**URL:** `/api/v1/powerbi/refresh/crop-dataset-001`
**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "message": "Dataset refresh triggered",
  "datasetId": "crop-dataset-001"
}
```

## Health and System Endpoints

### GET /health
**Description:** System health check
**Method:** GET
**URL:** `/api/v1/../health`

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T14:30:00Z"
}
```

### GET /
**Description:** API information
**Method:** GET
**URL:** `/api/v1/../`

**Response (200 OK):**
```json
{
  "message": "Agri Dashboard API - Static MVP",
  "status": "running"
}
```

## Error Response Format

All endpoints follow a consistent error response format:

**4xx Client Errors:**
```json
{
  "detail": "Error description",
  "timestamp": "2024-01-15T14:30:00Z"
}
```

**5xx Server Errors:**
```json
{
  "detail": "Internal server error",
  "timestamp": "2024-01-15T14:30:00Z"
}
```

## Common HTTP Status Codes

- **200 OK:** Successful request
- **201 Created:** Resource created successfully
- **400 Bad Request:** Invalid request data
- **401 Unauthorized:** Authentication required or invalid
- **403 Forbidden:** Access denied
- **404 Not Found:** Resource not found
- **422 Unprocessable Entity:** Validation error
- **500 Internal Server Error:** Server error

## Rate Limiting (Production)

In production, the following rate limits will apply:
- **Authentication endpoints:** 5 requests per minute
- **Data retrieval endpoints:** 100 requests per minute
- **Data modification endpoints:** 20 requests per minute
- **Power BI push endpoint:** 10 requests per minute

For the static MVP, rate limiting is disabled.

## Sample API Testing Script

```bash
#!/bin/bash

BASE_URL="http://localhost:8000/api/v1"

# 1. Login and get token
echo "Testing authentication..."
TOKEN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}')

TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')
echo "Token: $TOKEN"

# 2. Test farms endpoint
echo "Testing farms endpoint..."
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/farms" | jq

# 3. Test weather endpoint
echo "Testing weather endpoint..."
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/weather" | jq

# 4. Test alerts endpoint
echo "Testing alerts endpoint..."
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/alerts" | jq

# 5. Test Power BI push endpoint
echo "Testing Power BI push endpoint..."
curl -s -X POST "$BASE_URL/powerbi/push" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "datasetId": "test-dataset",
    "tableName": "test-table",
    "rows": [{"test": "data"}]
  }' | jq

echo "API testing complete!"
```

This API contract provides the complete interface specification for the static MVP, with clear indicators of what is mocked versus what will be implemented in production.