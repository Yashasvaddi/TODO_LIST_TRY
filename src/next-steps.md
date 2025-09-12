# Next Steps for Production Migration

## Phase 1: Database Integration (Immediate Priority)

### 🎯 **Goal:** Transition from mock data to live database operations

#### **Step 1.1: Database Setup**
```bash
# Uncomment database services in docker-compose.yml
# Start databases
docker-compose up postgres mongo redis -d

# Run database migrations
cd backend
alembic upgrade head

# Initialize MongoDB collections
mongo agridb --eval "db.createCollection('ndvi_data')"
mongo agridb --eval "db.createCollection('sensor_data')"
```

#### **Step 1.2: Replace Mock Data Functions**
**Priority Order:**
1. **Authentication System** (2-3 days)
   - Replace `mock_verify_token()` with real JWT validation
   - Implement user registration and password hashing
   - Add role-based access control (RBAC)

2. **Farm Management** (3-4 days)
   - Replace `MOCK_FARMS` with PostgreSQL queries
   - Implement proper CRUD operations with validation
   - Add farm ownership and permission checks

3. **Weather Data Integration** (2-3 days)
   - Connect to weather API (OpenWeatherMap/WeatherAPI)
   - Replace mock weather data with real-time feeds
   - Implement data caching and update schedules

4. **Alert System** (4-5 days)
   - Implement real alert generation logic
   - Add notification system (email/SMS)
   - Create alert escalation workflows

**Code Changes Required:**
```python
# Replace this in backend/app.py
MOCK_FARMS = [...] # Remove this

# With this
async def get_farms(db: Session = Depends(get_db)):
    return db.query(Farm).all()

async def create_farm(farm: FarmCreate, db: Session = Depends(get_db)):
    db_farm = Farm(**farm.dict())
    db.add(db_farm)
    db.commit()
    return db_farm
```

#### **Step 1.3: Environment Variables**
```bash
# Update .env file
DATABASE_URL=postgresql://user:pass@localhost:5432/agridb
MONGODB_URI=mongodb://localhost:27017/agridb
REDIS_URL=redis://localhost:6379

# Remove mock flags
USE_MOCK_DATA=false
```

**Estimated Timeline:** 2-3 weeks  
**Risk Level:** Low (well-defined interfaces)

---

## Phase 2: Azure AD Authentication (High Priority)

### 🎯 **Goal:** Replace mock authentication with enterprise-grade Azure AD

#### **Step 2.1: Azure AD Configuration**
```bash
# Azure CLI setup
az login
az ad app create --display-name "Agri Dashboard"
az ad app permission grant --id <app-id> --api 00000003-0000-0000-c000-000000000000
```

#### **Step 2.2: Frontend Authentication**
**Replace:** `components/auth-provider.tsx`
```typescript
// Add MSAL integration
import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: window.location.origin,
  }
};

const msalInstance = new PublicClientApplication(msalConfig);
```

#### **Step 2.3: Backend Token Validation**
**Replace:** `mock_verify_token()` function
```python
from azure.identity import DefaultAzureCredential
from jose import jwt

async def verify_azure_token(credentials: HTTPAuthorizationCredentials):
    try:
        # Validate Azure AD JWT token
        decoded_token = jwt.decode(
            credentials.credentials,
            key=get_azure_public_key(),
            algorithms=["RS256"],
            audience=AZURE_CLIENT_ID
        )
        return decoded_token
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

**Environment Variables:**
```bash
AZURE_CLIENT_ID=your_azure_client_id
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_CLIENT_SECRET=your_azure_client_secret
```

**Estimated Timeline:** 1-2 weeks  
**Risk Level:** Medium (requires Azure AD setup)

---

## Phase 3: Power BI Integration (Critical for Analytics)

### 🎯 **Goal:** Enable real-time data pushing and report embedding

#### **Step 3.1: Service Principal Setup**
```bash
# Create service principal in Azure
az ad sp create-for-rbac --name "PowerBI-Agri-Dashboard"

# Add to Power BI admin settings
# Grant permissions in Power BI service
```

#### **Step 3.2: Uncomment Power BI Code**
**In:** `components/powerbi-reports.tsx`
```typescript
// Uncomment this section:
/*
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

const powerbiConfig = {
  type: 'report',
  id: reportId,
  embedUrl: embedUrl,
  accessToken: accessToken,
  tokenType: models.TokenType.Embed,
  settings: {
    panes: {
      filters: { expanded: false, visible: true },
      pageNavigation: { visible: true }
    }
  }
};

<PowerBIEmbed
  embedConfig={powerbiConfig}
  eventHandlers={eventHandlers}
  cssClassName="report-container"
/>
*/
```

#### **Step 3.3: Implement Data Push Pipeline**
**Replace:** Mock push endpoint in `backend/app.py`
```python
# Uncomment and implement real Power BI push
async def push_data_to_powerbi(push_data: PowerBIPushData):
    # Get access token
    token_response = requests.post(
        f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token",
        data={
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "scope": "https://analysis.windows.net/powerbi/api/.default"
        }
    )
    access_token = token_response.json()["access_token"]
    
    # Push data to Power BI
    push_response = requests.post(
        f"https://api.powerbi.com/v1.0/myorg/datasets/{push_data.datasetId}/tables/{push_data.tableName}/rows",
        json={"rows": push_data.rows},
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    return push_response.status_code == 200
```

**Environment Variables:**
```bash
POWERBI_CLIENT_ID=your_powerbi_app_id
POWERBI_CLIENT_SECRET=your_powerbi_secret
POWERBI_TENANT_ID=your_tenant_id
POWERBI_WORKSPACE_ID=your_workspace_id
```

**Estimated Timeline:** 2-3 weeks  
**Risk Level:** Medium (requires Power BI admin access)

---

## Phase 4: External API Integration (Data Enhancement)

### 🎯 **Goal:** Connect real-time external data sources

#### **Step 4.1: Weather API Integration**
```python
# Replace mock weather data
import requests
from datetime import datetime

async def fetch_weather_data(farm_coordinates: str):
    lat, lon = farm_coordinates.split(", ")
    
    # OpenWeatherMap API call
    response = requests.get(
        f"https://api.openweathermap.org/data/2.5/weather",
        params={
            "lat": lat,
            "lon": lon,
            "appid": WEATHER_API_KEY,
            "units": "metric"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        return {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "conditions": data["weather"][0]["description"],
            "windSpeed": data["wind"]["speed"]
        }
```

#### **Step 4.2: Satellite Imagery Integration**
```python
# NDVI data from satellite APIs
async def fetch_ndvi_data(farm_polygon: dict):
    # Example: Planet Labs or Sentinel Hub API
    response = requests.post(
        "https://api.planet.com/analytics/v1/requests",
        headers={"Authorization": f"Bearer {SATELLITE_API_KEY}"},
        json={
            "geometry": farm_polygon,
            "indices": ["ndvi"],
            "date_range": "last_30_days"
        }
    )
    
    return response.json()
```

#### **Step 4.3: Market Data Integration**
```python
# Real-time commodity prices
async def fetch_market_data():
    # Example: Alpha Vantage or Quandl API
    response = requests.get(
        "https://www.alphavantage.co/query",
        params={
            "function": "COMMODITY_PRICES",
            "commodity": "wheat,corn,soybeans",
            "apikey": MARKET_API_KEY
        }
    )
    
    return response.json()
```

**Environment Variables:**
```bash
WEATHER_API_KEY=your_openweather_api_key
SATELLITE_API_KEY=your_satellite_api_key
MARKET_API_KEY=your_market_data_api_key
```

**Estimated Timeline:** 3-4 weeks  
**Risk Level:** Low (well-documented APIs)

---

## Phase 5: Real-time Features (Advanced)

### 🎯 **Goal:** Add real-time monitoring and alerting

#### **Step 5.1: WebSocket Integration**
```typescript
// Frontend WebSocket connection
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'alert') {
    // Update alerts in real-time
    setAlerts(prev => [...prev, data.alert]);
  }
  
  if (data.type === 'weather_update') {
    // Update weather data
    setWeatherData(data.weather);
  }
};
```

#### **Step 5.2: Background Jobs**
```python
# Celery background tasks for data collection
from celery import Celery

celery_app = Celery("agri_dashboard")

@celery_app.task
def collect_weather_data():
    for farm in get_all_farms():
        weather_data = fetch_weather_data(farm.coordinates)
        save_weather_data(farm.id, weather_data)

@celery_app.task
def generate_alerts():
    # Check conditions and generate alerts
    for farm in get_all_farms():
        check_weather_alerts(farm)
        check_ndvi_alerts(farm)
        check_market_alerts(farm)
```

#### **Step 5.3: Push Notifications**
```python
# Email/SMS alert system
from twilio.rest import Client

def send_alert_notification(alert: Alert, user: User):
    if alert.severity == "high":
        # Send SMS for high-priority alerts
        twilio_client.messages.create(
            body=f"URGENT: {alert.title} at {alert.farmName}",
            from_=TWILIO_PHONE,
            to=user.phone
        )
    
    # Always send email
    send_email(
        to=user.email,
        subject=f"Farm Alert: {alert.title}",
        body=alert.description
    )
```

**Estimated Timeline:** 4-5 weeks  
**Risk Level:** High (complex real-time system)

---

## Implementation Timeline & Resource Planning

### **Phase Priority Matrix**

| Phase | Priority | Timeline | Resources | Risk |
|-------|----------|----------|-----------|------|
| Phase 1: Database | **HIGH** | 2-3 weeks | 1 Backend Dev | Low |
| Phase 2: Azure AD | **HIGH** | 1-2 weeks | 1 Full-stack Dev | Medium |
| Phase 3: Power BI | **CRITICAL** | 2-3 weeks | 1 BI Specialist + 1 Dev | Medium |
| Phase 4: External APIs | **MEDIUM** | 3-4 weeks | 1 Backend Dev | Low |
| Phase 5: Real-time | **LOW** | 4-5 weeks | 2 Developers | High |

### **Parallel Development Strategy**

**Week 1-2:**
- Start Phase 1 (Database) + Phase 2 (Azure AD) in parallel
- Both phases have minimal overlap

**Week 3-4:**
- Continue Database integration
- Begin Power BI setup (Phase 3)

**Week 5-8:**
- Complete Power BI integration
- Start External APIs (Phase 4)

**Week 9-12:**
- Complete External APIs
- Begin Real-time features (Phase 5) if needed

### **Success Criteria by Phase**

#### **Phase 1 Complete When:**
- [ ] Mock data completely removed
- [ ] All CRUD operations work with PostgreSQL
- [ ] User authentication stores sessions in database
- [ ] Weather data saves to database
- [ ] Farm polygons stored in PostGIS

#### **Phase 2 Complete When:**
- [ ] Users can login with Azure AD accounts
- [ ] JWT tokens validated against Azure
- [ ] Role-based permissions enforced
- [ ] Single sign-on (SSO) works

#### **Phase 3 Complete When:**
- [ ] Reports embed successfully in dashboard
- [ ] Data pushes to Power BI datasets
- [ ] Reports refresh automatically
- [ ] Multiple reports accessible

#### **Phase 4 Complete When:**
- [ ] Weather data updates every hour
- [ ] NDVI data refreshes daily
- [ ] Market prices update every 15 minutes
- [ ] API failures don't crash system

#### **Phase 5 Complete When:**
- [ ] Alerts generate automatically
- [ ] Users receive notifications
- [ ] Dashboard updates in real-time
- [ ] System handles concurrent users

---

## Risk Mitigation Strategies

### **Technical Risks**

1. **Database Migration Issues**
   - **Mitigation:** Keep mock endpoints as backup during transition
   - **Rollback:** Environment variable to switch back to mock data

2. **Azure AD Configuration Problems**
   - **Mitigation:** Test in development Azure tenant first
   - **Rollback:** Temporary admin bypass for critical issues

3. **Power BI Permission Denials**
   - **Mitigation:** Work with Power BI admin before development
   - **Backup:** Static report images as temporary solution

4. **External API Rate Limits**
   - **Mitigation:** Implement caching and request throttling
   - **Backup:** Use cached data when APIs unavailable

### **Business Risks**

1. **Budget Overruns**
   - **Control:** Phase-based budgeting with go/no-go decisions
   - **Mitigation:** Prioritize critical phases first

2. **Timeline Delays**
   - **Control:** Weekly progress reviews
   - **Mitigation:** Parallel development where possible

3. **User Adoption Issues**
   - **Control:** User testing after each phase
   - **Mitigation:** Training materials and documentation

---

## Quality Assurance Plan

### **Testing Strategy by Phase**

**Phase 1 Testing:**
```bash
# Database integration tests
pytest tests/test_database.py
pytest tests/test_auth.py
pytest tests/test_farms.py
```

**Phase 2 Testing:**
```bash
# Azure AD integration tests
pytest tests/test_azure_auth.py
# Manual testing with real Azure accounts
```

**Phase 3 Testing:**
```bash
# Power BI integration tests
pytest tests/test_powerbi.py
# Manual testing of report embedding
```

### **Production Readiness Checklist**

#### **Security**
- [ ] All secrets in secure vault (Azure Key Vault)
- [ ] HTTPS enforced everywhere
- [ ] API rate limiting implemented
- [ ] SQL injection protection verified
- [ ] CORS properly configured

#### **Performance**
- [ ] Database queries optimized
- [ ] API response times < 500ms
- [ ] Frontend loads < 3 seconds
- [ ] System handles 100+ concurrent users

#### **Monitoring**
- [ ] Application logging (ELK stack)
- [ ] Performance monitoring (APM)
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Database monitoring

#### **Backup & Recovery**
- [ ] Automated database backups
- [ ] Disaster recovery plan tested
- [ ] Data retention policies defined
- [ ] Recovery time objectives met

---

## Support & Maintenance Plan

### **Ongoing Responsibilities**

**Daily Tasks:**
- Monitor system health and alerts
- Review error logs and resolve issues
- Check external API status

**Weekly Tasks:**
- Review performance metrics
- Update market data APIs if needed
- Test backup and recovery procedures

**Monthly Tasks:**
- Security updates and patches
- Performance optimization review
- User feedback collection and analysis

### **Emergency Procedures**

**System Down:**
1. Check infrastructure status
2. Review recent deployments
3. Activate rollback if needed
4. Notify stakeholders

**Data Loss:**
1. Stop all write operations
2. Assess scope of loss
3. Restore from backup
4. Validate data integrity

**Security Incident:**
1. Isolate affected systems
2. Change all credentials
3. Review access logs
4. Report to security team

This comprehensive next steps guide provides a clear roadmap for transitioning from the static MVP to a production-ready agricultural dashboard system.