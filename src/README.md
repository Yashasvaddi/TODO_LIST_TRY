# Geo-Spatial Multilingual Agri Admin Dashboard - Static MVP

## Executive Summary

This static MVP provides a fully functional admin dashboard with mock geo-spatial data, NDVI analytics, and Power BI integration placeholders. The architecture uses clearly marked data boundaries and API contracts that enable rapid transition to live PostgreSQL/MongoDB backends and real Power BI datasets. All components are built with separation of concerns, making the switch from static JSON to live APIs a simple configuration change.

## Project Structure

```
agri-dashboard/
├── frontend/                    # React/Next.js Frontend
│   ├── components/
│   │   ├── auth-provider.tsx    # Mock JWT authentication
│   │   ├── login-form.tsx       # Authentication interface
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   ├── dashboard.tsx        # Main dashboard with KPIs
│   │   ├── map-viewer.tsx       # Leaflet map integration (mock)
│   │   ├── powerbi-reports.tsx  # Power BI embedding (mock)
│   │   ├── data-explorer.tsx    # CRUD data interface
│   │   ├── alert-manager.tsx    # Alert management system
│   │   └── ui/                  # ShadCN UI components
│   ├── App.tsx                  # Main application component
│   ├── styles/globals.css       # Tailwind CSS configuration
│   └── package.json
├── backend/                     # FastAPI Backend (Mock)
│   ├── app.py                   # Main FastAPI application
│   ├── models/                  # Data models and schemas
│   ├── routes/                  # API route handlers
│   ├── data/                    # Mock JSON data files
│   └── requirements.txt
├── infrastructure/              # Docker & Deployment
│   ├── docker-compose.yml       # Multi-service orchestration
│   ├── Dockerfile.frontend      # Frontend container
│   ├── Dockerfile.backend       # Backend container
│   └── .env.example            # Environment variables template
├── docs/                       # Documentation
│   ├── api-contract.md         # API specifications
│   ├── powerbi-integration.md  # Power BI setup guide
│   └── deployment-guide.md     # Deployment instructions
└── scripts/                   # Utility scripts
    ├── setup.sh               # Initial setup script
    └── powerbi-blueprint.py   # Power BI integration blueprint
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker & Docker Compose (optional)

### Local Development Setup

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd agri-dashboard
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Start Frontend (Development)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Access at: http://localhost:3000

3. **Start Backend (Mock API)**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app:app --reload --port 8000
   ```
   API docs at: http://localhost:8000/docs

### Docker Setup (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Features (Static MVP)

### ✅ Implemented (Mock Data)

1. **Authentication System**
   - Mock JWT validation (always succeeds)
   - Role-based access placeholders
   - Session management interface

2. **Geo-Spatial Farm Viewer**
   - Mock Leaflet map integration
   - Static GeoJSON farm polygons
   - NDVI overlay simulation
   - Farm detail popups

3. **Power BI Dashboard Placeholder**
   - Report embedding structure
   - Mock dataset management
   - Integration configuration UI
   - Push API endpoints (logged only)

4. **Data Explorer**
   - CRUD interface for farms, weather, market data
   - Mock database operations
   - Data validation and editing
   - Export/import placeholders

5. **NDVI Analytics**
   - Time-series chart visualization
   - Mock satellite data integration
   - Vegetation health indicators
   - Trend analysis charts

6. **Alert Management**
   - Weather, pest, disease, market alerts
   - Severity classification system
   - Status workflow (active → acknowledged → resolved)
   - Action tracking

### 🔧 Ready for Production Integration

- **Database Schemas**: PostgreSQL/MongoDB models defined
- **API Contracts**: Complete OpenAPI specifications
- **Power BI Hooks**: Authentication and embedding code ready
- **Real-time Data**: WebSocket connection points marked
- **Security**: Environment variable structure defined

## Authentication (Mock)

The current system accepts any email/password combination for development:

```typescript
// Mock credentials (any values work)
Email: admin@example.com
Password: any_password
```

In production, this will be replaced with:
- Azure AD integration
- JWT token validation
- Role-based permissions
- Session management

## API Endpoints (Mock)

Base URL: `http://localhost:8000/api/v1`

### Authentication
- `POST /auth/login` - Mock login (always succeeds)
- `POST /auth/logout` - Session termination
- `GET /auth/me` - Current user info

### Farm Management
- `GET /farms` - List all farms
- `POST /farms` - Create new farm
- `GET /farms/{id}` - Get farm details
- `PUT /farms/{id}` - Update farm
- `DELETE /farms/{id}` - Delete farm

### Weather Data
- `GET /weather` - Weather data by farm/date range
- `POST /weather` - Add weather reading
- `GET /weather/current` - Current conditions

### Market Data
- `GET /market/prices` - Commodity prices
- `GET /market/trends` - Market trends
- `POST /market/alerts` - Price alert configuration

### Power BI Integration
- `POST /powerbi/push` - Push data to Power BI (mock)
- `GET /powerbi/reports` - Available reports list
- `POST /powerbi/refresh` - Trigger report refresh

### Alerts
- `GET /alerts` - List alerts with filters
- `POST /alerts` - Create new alert
- `PUT /alerts/{id}/status` - Update alert status
- `DELETE /alerts/{id}` - Dismiss alert

## Mock Data Structure

### Farm Data
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

### Weather Data
```json
{
  "farmId": "farm_001",
  "date": "2024-01-15",
  "temperature": 24.5,
  "humidity": 68,
  "rainfall": 12.3,
  "windSpeed": 8.2,
  "conditions": "Partly Cloudy"
}
```

### NDVI Data
```json
{
  "farmId": "farm_001",
  "date": "2024-01-15",
  "ndvi": 0.82,
  "coverage": "89.3",
  "healthStatus": "healthy"
}
```

### Alert Data
```json
{
  "id": "alert_001",
  "type": "weather",
  "severity": "high",
  "title": "Heavy Rain Warning",
  "description": "Expected rainfall of 45mm in the next 6 hours",
  "farmId": "farm_001",
  "status": "active",
  "timestamp": "2024-01-15T08:30:00Z"
}
```

## Environment Variables

Create `.env` file:

```bash
# API Configuration
API_BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Database (Production Only)
DATABASE_URL=postgresql://user:pass@localhost:5432/agridb
MONGODB_URI=mongodb://localhost:27017/agridb

# Power BI (Production Only)
POWERBI_CLIENT_ID=your_client_id
POWERBI_CLIENT_SECRET=your_client_secret
POWERBI_TENANT_ID=your_tenant_id
POWERBI_WORKSPACE_ID=your_workspace_id

# Authentication (Production Only)
JWT_SECRET_KEY=your_jwt_secret
AZURE_AD_CLIENT_ID=your_azure_ad_client_id
AZURE_AD_TENANT_ID=your_azure_ad_tenant_id

# External APIs (Production Only)
WEATHER_API_KEY=your_weather_api_key
SATELLITE_API_KEY=your_satellite_api_key
```

## Testing the Static MVP

### Functional Tests

1. **Authentication Flow**
   - [ ] Login with any credentials succeeds
   - [ ] User session persists during navigation
   - [ ] Logout clears session properly

2. **Dashboard Features**
   - [ ] KPI cards display mock data
   - [ ] Charts render correctly
   - [ ] Responsive layout works on mobile

3. **Map Viewer**
   - [ ] Map container displays placeholder
   - [ ] Farm list shows mock farms
   - [ ] Farm selection updates details panel

4. **Data Explorer**
   - [ ] Tables load with mock data
   - [ ] Edit dialogs open with correct data
   - [ ] CRUD operations log correctly

5. **Power BI Integration**
   - [ ] Report list displays mock reports
   - [ ] Embed container shows placeholder
   - [ ] Configuration shows mock credentials

6. **Alert Management**
   - [ ] Alerts load with correct status
   - [ ] Status changes update UI
   - [ ] Filters work correctly

### API Tests

```bash
# Test all mock endpoints
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

curl http://localhost:8000/api/v1/farms
curl http://localhost:8000/api/v1/weather
curl http://localhost:8000/api/v1/alerts
```

## Production Migration Path

### Phase 1: Database Integration
1. Uncomment database services in docker-compose.yml
2. Replace mock data with database calls
3. Implement proper authentication
4. Set up environment variables

### Phase 2: Power BI Integration
1. Configure Azure AD application
2. Uncomment Power BI embedding code
3. Set up dataset refresh schedules
4. Implement real-time data push

### Phase 3: External APIs
1. Integrate weather data APIs
2. Connect satellite imagery services
3. Implement real-time alerts
4. Set up monitoring and logging

## Support

For questions about this static MVP:

1. Check the mock data in `/backend/data/` directory
2. Review API documentation at `/docs/api-contract.md`
3. Check Docker logs for any issues
4. Verify environment variables are set correctly

## Next Steps for Production

- [ ] Replace mock authentication with Azure AD
- [ ] Integrate PostgreSQL/MongoDB databases
- [ ] Set up Power BI service principal
- [ ] Configure real-time data pipelines
- [ ] Implement proper error handling
- [ ] Add comprehensive logging
- [ ] Set up monitoring and alerts
- [ ] Configure CI/CD pipeline
- [ ] Implement data backup and recovery
- [ ] Add comprehensive test suite