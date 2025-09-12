# Backend Structure and API Implementation Guide

## FastAPI Backend Structure (app.py)

```python
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
from datetime import datetime, timedelta
import jwt
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Agri Dashboard API",
    description="Mock API for Agricultural Dashboard - Static MVP",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Data Models
class Farm(BaseModel):
    id: str
    name: str
    location: str
    area: float
    crop: str
    owner: str
    coordinates: str
    status: str

class WeatherData(BaseModel):
    id: str
    farmId: str
    date: str
    temperature: float
    humidity: float
    rainfall: float
    windSpeed: float
    conditions: str

class MarketData(BaseModel):
    id: str
    commodity: str
    price: float
    currency: str
    unit: str
    change: str
    market: str
    lastUpdated: str

class Alert(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    description: str
    farmId: str
    farmName: str
    timestamp: str
    status: str
    affectedArea: str
    actionRequired: str

class LoginRequest(BaseModel):
    email: str
    password: str

class PowerBIPushData(BaseModel):
    datasetId: str
    tableName: str
    rows: List[Dict[str, Any]]

# Mock Data Storage (In production: Replace with database calls)
MOCK_FARMS = [
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

MOCK_WEATHER = [
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

MOCK_MARKET = [
    {
        "id": "market_001",
        "commodity": "Wheat",
        "price": 285.50,
        "currency": "USD",
        "unit": "per ton",
        "change": "+2.3%",
        "market": "Chicago Board of Trade",
        "lastUpdated": "2024-01-15T14:30:00Z"
    }
]

MOCK_ALERTS = [
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

# Mock JWT Authentication (Always succeeds for MVP)
def mock_verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Mock JWT verification - always succeeds for MVP
    In production, replace with real JWT validation:
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "email": payload.get("email")}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    """
    return {"user_id": "mock_user", "email": "admin@example.com", "role": "admin"}

# Routes

@app.get("/")
async def root():
    return {"message": "Agri Dashboard API - Static MVP", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Authentication Routes
@app.post("/api/v1/auth/login")
async def login(login_data: LoginRequest):
    """
    Mock login endpoint - always succeeds for MVP
    In production, replace with actual authentication
    """
    logger.info(f"Mock login attempt for: {login_data.email}")
    
    # Mock JWT generation
    mock_token = "mock_jwt_token_" + login_data.email.replace("@", "_")
    
    # In production:
    # if not authenticate_user(login_data.email, login_data.password):
    #     raise HTTPException(status_code=401, detail="Invalid credentials")
    # 
    # payload = {"sub": user.id, "email": user.email, "exp": datetime.utcnow() + timedelta(hours=24)}
    # token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    
    return {
        "access_token": mock_token,
        "token_type": "bearer",
        "user": {
            "id": "mock_user_id",
            "email": login_data.email,
            "name": "Mock Admin User",
            "role": "admin"
        }
    }

@app.post("/api/v1/auth/logout")
async def logout(current_user: dict = Depends(mock_verify_token)):
    """Mock logout endpoint"""
    return {"message": "Successfully logged out"}

@app.get("/api/v1/auth/me")
async def get_current_user(current_user: dict = Depends(mock_verify_token)):
    """Get current user info"""
    return current_user

# Farm Management Routes
@app.get("/api/v1/farms", response_model=List[Farm])
async def get_farms(current_user: dict = Depends(mock_verify_token)):
    """
    Get all farms (mock data)
    In production: return await database.fetch_farms()
    """
    return MOCK_FARMS

@app.get("/api/v1/farms/{farm_id}")
async def get_farm(farm_id: str, current_user: dict = Depends(mock_verify_token)):
    """Get specific farm details"""
    farm = next((f for f in MOCK_FARMS if f["id"] == farm_id), None)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm

@app.post("/api/v1/farms")
async def create_farm(farm: Farm, current_user: dict = Depends(mock_verify_token)):
    """Create new farm (mock operation)"""
    logger.info(f"Mock farm creation: {farm.name}")
    # In production: farm_id = await database.create_farm(farm)
    return {"message": "Farm created successfully", "farm_id": farm.id}

@app.put("/api/v1/farms/{farm_id}")
async def update_farm(farm_id: str, farm: Farm, current_user: dict = Depends(mock_verify_token)):
    """Update farm (mock operation)"""
    logger.info(f"Mock farm update: {farm_id}")
    # In production: await database.update_farm(farm_id, farm)
    return {"message": "Farm updated successfully"}

@app.delete("/api/v1/farms/{farm_id}")
async def delete_farm(farm_id: str, current_user: dict = Depends(mock_verify_token)):
    """Delete farm (mock operation)"""
    logger.info(f"Mock farm deletion: {farm_id}")
    # In production: await database.delete_farm(farm_id)
    return {"message": "Farm deleted successfully"}

# Weather Data Routes
@app.get("/api/v1/weather")
async def get_weather_data(
    farm_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: dict = Depends(mock_verify_token)
):
    """Get weather data with optional filters"""
    # In production: return await database.fetch_weather_data(farm_id, start_date, end_date)
    return MOCK_WEATHER

@app.post("/api/v1/weather")
async def add_weather_data(weather: WeatherData, current_user: dict = Depends(mock_verify_token)):
    """Add new weather reading"""
    logger.info(f"Mock weather data addition: {weather.farmId}")
    # In production: await database.insert_weather_data(weather)
    return {"message": "Weather data added successfully"}

# Market Data Routes
@app.get("/api/v1/market/prices")
async def get_market_prices(current_user: dict = Depends(mock_verify_token)):
    """Get current market prices"""
    # In production: return await market_api.fetch_current_prices()
    return MOCK_MARKET

@app.get("/api/v1/market/trends")
async def get_market_trends(
    commodity: Optional[str] = None,
    days: int = 30,
    current_user: dict = Depends(mock_verify_token)
):
    """Get market trends for specified period"""
    # Mock trend data
    return {
        "commodity": commodity or "wheat",
        "period_days": days,
        "trend": "upward",
        "change_percent": 2.3,
        "data_points": [
            {"date": "2024-01-10", "price": 280.50},
            {"date": "2024-01-15", "price": 285.50}
        ]
    }

# Alert Management Routes
@app.get("/api/v1/alerts")
async def get_alerts(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    alert_type: Optional[str] = None,
    current_user: dict = Depends(mock_verify_token)
):
    """Get alerts with optional filters"""
    filtered_alerts = MOCK_ALERTS
    
    if severity:
        filtered_alerts = [a for a in filtered_alerts if a["severity"] == severity]
    if status:
        filtered_alerts = [a for a in filtered_alerts if a["status"] == status]
    if alert_type:
        filtered_alerts = [a for a in filtered_alerts if a["type"] == alert_type]
    
    return filtered_alerts

@app.post("/api/v1/alerts")
async def create_alert(alert: Alert, current_user: dict = Depends(mock_verify_token)):
    """Create new alert"""
    logger.info(f"Mock alert creation: {alert.title}")
    # In production: await database.create_alert(alert)
    return {"message": "Alert created successfully", "alert_id": alert.id}

@app.put("/api/v1/alerts/{alert_id}/status")
async def update_alert_status(
    alert_id: str, 
    status_data: dict,
    current_user: dict = Depends(mock_verify_token)
):
    """Update alert status"""
    new_status = status_data.get("status")
    logger.info(f"Mock alert status update: {alert_id} -> {new_status}")
    # In production: await database.update_alert_status(alert_id, new_status)
    return {"message": "Alert status updated successfully"}

@app.delete("/api/v1/alerts/{alert_id}")
async def dismiss_alert(alert_id: str, current_user: dict = Depends(mock_verify_token)):
    """Dismiss alert"""
    logger.info(f"Mock alert dismissal: {alert_id}")
    # In production: await database.dismiss_alert(alert_id)
    return {"message": "Alert dismissed successfully"}

# Power BI Integration Routes
@app.get("/api/v1/powerbi/reports")
async def get_powerbi_reports(current_user: dict = Depends(mock_verify_token)):
    """Get available Power BI reports"""
    mock_reports = [
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
    return mock_reports

@app.post("/api/v1/powerbi/push")
async def push_data_to_powerbi(
    push_data: PowerBIPushData, 
    current_user: dict = Depends(mock_verify_token)
):
    """
    CRITICAL: Mock Power BI push endpoint
    This is where live Power BI PostRows API call would happen
    """
    logger.info(f"Mock Power BI data push - Dataset: {push_data.datasetId}, Table: {push_data.tableName}")
    logger.info(f"Mock data rows count: {len(push_data.rows)}")
    
    # Log the data that would be pushed
    for i, row in enumerate(push_data.rows[:3]):  # Log first 3 rows only
        logger.info(f"Sample row {i+1}: {row}")
    
    # In production, this would make the actual Power BI API call:
    """
    import requests
    
    # Get access token
    token_url = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
    token_data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "scope": "https://analysis.windows.net/powerbi/api/.default"
    }
    token_response = requests.post(token_url, data=token_data)
    access_token = token_response.json()["access_token"]
    
    # Push data to dataset
    push_url = f"https://api.powerbi.com/v1.0/myorg/datasets/{push_data.datasetId}/tables/{push_data.tableName}/rows"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    push_response = requests.post(push_url, json={"rows": push_data.rows}, headers=headers)
    
    if push_response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to push data to Power BI")
    """
    
    return {
        "message": "Data push to Power BI simulated successfully",
        "datasetId": push_data.datasetId,
        "tableName": push_data.tableName,
        "rowCount": len(push_data.rows),
        "status": "mock_success"
    }

@app.post("/api/v1/powerbi/refresh/{dataset_id}")
async def refresh_powerbi_dataset(dataset_id: str, current_user: dict = Depends(mock_verify_token)):
    """Trigger Power BI dataset refresh"""
    logger.info(f"Mock Power BI dataset refresh: {dataset_id}")
    # In production: trigger actual dataset refresh
    return {"message": "Dataset refresh triggered", "datasetId": dataset_id}

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "timestamp": datetime.now().isoformat()}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Database Schema (Production Ready)

### PostgreSQL Schema (farms, weather, operational data)

```sql
-- Farms table
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    area_hectares DECIMAL(10,2),
    crop_type VARCHAR(100),
    owner_name VARCHAR(255),
    coordinates POINT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Weather data table
CREATE TABLE weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id),
    recorded_at TIMESTAMP NOT NULL,
    temperature_celsius DECIMAL(5,2),
    humidity_percent INTEGER,
    rainfall_mm DECIMAL(6,2),
    wind_speed_kmh DECIMAL(5,2),
    conditions VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market data table
CREATE TABLE market_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    commodity VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    unit VARCHAR(50),
    market_source VARCHAR(255),
    recorded_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    farm_id UUID REFERENCES farms(id),
    status VARCHAR(20) DEFAULT 'active',
    affected_area VARCHAR(100),
    action_required TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB Schema (satellite data, IoT sensors)

```javascript
// NDVI Collection
{
  _id: ObjectId,
  farmId: String,
  date: Date,
  ndviValue: Number,
  coverageArea: Number,
  healthStatus: String,
  satelliteSource: String,
  cloudCover: Number,
  metadata: {
    processingDate: Date,
    algorithmVersion: String,
    confidence: Number
  }
}

// Sensor Data Collection
{
  _id: ObjectId,
  farmId: String,
  sensorId: String,
  sensorType: String, // soil, weather, irrigation
  timestamp: Date,
  readings: {
    soilMoisture: Number,
    soilTemperature: Number,
    pH: Number,
    nutrients: {
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number
    }
  },
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  }
}
```

## Requirements.txt (Backend)

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
requests==2.31.0
psycopg2-binary==2.9.9
pymongo==4.6.0
python-dotenv==1.0.0
sqlalchemy==2.0.23
alembic==1.13.1
redis==5.0.1
celery==5.3.4
```

## Docker Compose (Full Stack)

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/agridb
      - MONGODB_URI=mongodb://mongo:27017/agridb
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - mongo
      - redis
    volumes:
      - ./backend:/app

  # Uncomment for production database integration
  # postgres:
  #   image: postgres:15
  #   environment:
  #     POSTGRES_DB: agridb
  #     POSTGRES_USER: postgres
  #     POSTGRES_PASSWORD: password
  #   ports:
  #     - "5432:5432"
  #   volumes:
  #     - postgres_data:/var/lib/postgresql/data

  # mongo:
  #   image: mongo:7
  #   ports:
  #     - "27017:27017"
  #   volumes:
  #     - mongo_data:/data/db

  # redis:
  #   image: redis:7
  #   ports:
  #     - "6379:6379"

volumes:
  postgres_data:
  mongo_data:
```

This backend structure provides a complete foundation for transitioning from mock data to production databases while maintaining clear separation of concerns and readiness for Power BI integration.