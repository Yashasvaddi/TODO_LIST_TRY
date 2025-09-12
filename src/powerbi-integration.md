# Power BI Integration Guide - Production Implementation

## Azure AD App Permissions & Configuration

### Step 1: Azure AD Application Setup

1. **Register Application in Azure Portal**
   ```
   Navigate to: Azure Portal > Azure Active Directory > App registrations > New registration
   
   Application Details:
   - Name: "Agri Dashboard Power BI Integration"
   - Supported account types: "Accounts in this organizational directory only"
   - Redirect URI: Not required for service principal
   ```

2. **Required API Permissions**
   ```
   Add the following Microsoft APIs permissions:
   
   Power BI Service (https://analysis.windows.net/powerbi/api):
   ✓ Dataset.ReadWrite.All (Application)
   ✓ Report.ReadWrite.All (Application)
   ✓ Workspace.ReadWrite.All (Application)
   ✓ Content.Create (Application)
   
   Microsoft Graph:
   ✓ User.Read (Delegated) - for user context if needed
   
   Grant admin consent for all permissions
   ```

3. **Generate Client Secret**
   ```
   Go to: Certificates & secrets > New client secret
   - Description: "Agri Dashboard API Secret"
   - Expires: 24 months (recommended)
   - Copy the secret value immediately - you won't see it again
   ```

### Step 2: Power BI Service Configuration

1. **Enable Service Principal in Power BI Admin**
   ```
   Power BI Admin Portal > Tenant settings > Developer settings
   ✓ Allow service principals to use Power BI APIs
   ✓ Allow service principals to create and use profiles
   
   Add your App ID to the "Specific security groups" list
   ```

2. **Workspace Setup**
   ```
   Create a dedicated workspace for the application:
   - Name: "Agri Dashboard Analytics"
   - Add your service principal as Admin
   - Configure workspace settings for API access
   ```

## Two-Step Authentication Process

### Step 1: Get Access Token

```python
import requests
import os
from datetime import datetime, timedelta

class PowerBIAuthenticator:
    def __init__(self):
        self.client_id = os.getenv('POWERBI_CLIENT_ID')
        self.client_secret = os.getenv('POWERBI_CLIENT_SECRET')
        self.tenant_id = os.getenv('POWERBI_TENANT_ID')
        self.token_url = f"https://login.microsoftonline.com/{self.tenant_id}/oauth2/v2.0/token"
        self.access_token = None
        self.token_expires_at = None
    
    async def get_access_token(self) -> str:
        """
        Get access token using client credentials flow
        Endpoint: https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token
        Scope: https://analysis.windows.net/powerbi/api/.default
        """
        
        if self.access_token and self.token_expires_at > datetime.now():
            return self.access_token
        
        token_data = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "scope": "https://analysis.windows.net/powerbi/api/.default"
        }
        
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        try:
            response = requests.post(self.token_url, data=token_data, headers=headers)
            response.raise_for_status()
            
            token_response = response.json()
            self.access_token = token_response["access_token"]
            expires_in = token_response.get("expires_in", 3600)
            self.token_expires_at = datetime.now() + timedelta(seconds=expires_in - 300)  # 5min buffer
            
            return self.access_token
            
        except requests.RequestException as e:
            raise Exception(f"Failed to get Power BI access token: {str(e)}")
```

### Step 2: Push Data to Power BI

```python
class PowerBIDataPusher:
    def __init__(self, authenticator: PowerBIAuthenticator):
        self.auth = authenticator
        self.base_url = "https://api.powerbi.com/v1.0/myorg"
    
    async def create_dataset(self, workspace_id: str, dataset_schema: dict) -> str:
        """
        Create a new dataset in Power BI
        Endpoint: POST https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}/datasets
        """
        access_token = await self.auth.get_access_token()
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        url = f"{self.base_url}/groups/{workspace_id}/datasets"
        
        try:
            response = requests.post(url, json=dataset_schema, headers=headers)
            response.raise_for_status()
            
            result = response.json()
            return result["id"]
            
        except requests.RequestException as e:
            raise Exception(f"Failed to create Power BI dataset: {str(e)}")
    
    async def push_data_to_table(self, dataset_id: str, table_name: str, rows: list) -> bool:
        """
        Push data rows to Power BI table
        Endpoint: POST https://api.powerbi.com/v1.0/myorg/datasets/{dataset_id}/tables/{table_name}/rows
        """
        access_token = await self.auth.get_access_token()
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        url = f"{self.base_url}/datasets/{dataset_id}/tables/{table_name}/rows"
        
        # Power BI has a limit of 10,000 rows per request
        chunk_size = 10000
        
        try:
            for i in range(0, len(rows), chunk_size):
                chunk = rows[i:i + chunk_size]
                payload = {"rows": chunk}
                
                response = requests.post(url, json=payload, headers=headers)
                response.raise_for_status()
                
                print(f"Successfully pushed {len(chunk)} rows to {table_name}")
            
            return True
            
        except requests.RequestException as e:
            raise Exception(f"Failed to push data to Power BI: {str(e)}")
    
    async def delete_table_rows(self, dataset_id: str, table_name: str) -> bool:
        """
        Clear all rows from a Power BI table
        Endpoint: DELETE https://api.powerbi.com/v1.0/myorg/datasets/{dataset_id}/tables/{table_name}/rows
        """
        access_token = await self.auth.get_access_token()
        
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        url = f"{self.base_url}/datasets/{dataset_id}/tables/{table_name}/rows"
        
        try:
            response = requests.delete(url, headers=headers)
            response.raise_for_status()
            return True
            
        except requests.RequestException as e:
            raise Exception(f"Failed to clear Power BI table: {str(e)}")
```

## Dataset Schema Creation Blueprint

```python
class PowerBISchemaBuilder:
    """
    Blueprint for creating Power BI dataset schemas
    This demonstrates the structure but won't run until integrated
    """
    
    @staticmethod
    def create_farm_analytics_schema() -> dict:
        """Schema for farm analytics dataset"""
        return {
            "name": "AgriDashboard_FarmAnalytics",
            "defaultMode": "Push",
            "tables": [
                {
                    "name": "FarmData",
                    "columns": [
                        {"name": "FarmID", "dataType": "string"},
                        {"name": "FarmName", "dataType": "string"},
                        {"name": "Location", "dataType": "string"},
                        {"name": "AreaHectares", "dataType": "double"},
                        {"name": "CropType", "dataType": "string"},
                        {"name": "Owner", "dataType": "string"},
                        {"name": "Latitude", "dataType": "double"},
                        {"name": "Longitude", "dataType": "double"},
                        {"name": "Status", "dataType": "string"},
                        {"name": "LastUpdated", "dataType": "datetime"}
                    ]
                },
                {
                    "name": "NDVIData",
                    "columns": [
                        {"name": "FarmID", "dataType": "string"},
                        {"name": "Date", "dataType": "datetime"},
                        {"name": "NDVIValue", "dataType": "double"},
                        {"name": "CoverageArea", "dataType": "double"},
                        {"name": "HealthStatus", "dataType": "string"},
                        {"name": "SatelliteSource", "dataType": "string"},
                        {"name": "CloudCover", "dataType": "double"}
                    ]
                },
                {
                    "name": "WeatherData",
                    "columns": [
                        {"name": "FarmID", "dataType": "string"},
                        {"name": "Date", "dataType": "datetime"},
                        {"name": "Temperature", "dataType": "double"},
                        {"name": "Humidity", "dataType": "double"},
                        {"name": "Rainfall", "dataType": "double"},
                        {"name": "WindSpeed", "dataType": "double"},
                        {"name": "Conditions", "dataType": "string"}
                    ]
                }
            ]
        }
    
    @staticmethod
    def create_market_analytics_schema() -> dict:
        """Schema for market analytics dataset"""
        return {
            "name": "AgriDashboard_MarketAnalytics",
            "defaultMode": "Push",
            "tables": [
                {
                    "name": "MarketPrices",
                    "columns": [
                        {"name": "Commodity", "dataType": "string"},
                        {"name": "Price", "dataType": "double"},
                        {"name": "Currency", "dataType": "string"},
                        {"name": "Unit", "dataType": "string"},
                        {"name": "MarketSource", "dataType": "string"},
                        {"name": "Date", "dataType": "datetime"},
                        {"name": "ChangePercent", "dataType": "double"}
                    ]
                },
                {
                    "name": "PriceTrends",
                    "columns": [
                        {"name": "Commodity", "dataType": "string"},
                        {"name": "Date", "dataType": "datetime"},
                        {"name": "OpenPrice", "dataType": "double"},
                        {"name": "ClosePrice", "dataType": "double"},
                        {"name": "HighPrice", "dataType": "double"},
                        {"name": "LowPrice", "dataType": "double"},
                        {"name": "Volume", "dataType": "int64"}
                    ]
                }
            ]
        }
```

## Data Push Implementation

```python
class AgriDataPipeline:
    """
    Complete data pipeline for pushing agricultural data to Power BI
    """
    
    def __init__(self):
        self.auth = PowerBIAuthenticator()
        self.pusher = PowerBIDataPusher(self.auth)
        self.workspace_id = os.getenv('POWERBI_WORKSPACE_ID')
    
    async def setup_datasets(self):
        """Initialize all required datasets"""
        schema_builder = PowerBISchemaBuilder()
        
        # Create farm analytics dataset
        farm_schema = schema_builder.create_farm_analytics_schema()
        self.farm_dataset_id = await self.pusher.create_dataset(
            self.workspace_id, 
            farm_schema
        )
        
        # Create market analytics dataset
        market_schema = schema_builder.create_market_analytics_schema()
        self.market_dataset_id = await self.pusher.create_dataset(
            self.workspace_id, 
            market_schema
        )
        
        print(f"Farm dataset ID: {self.farm_dataset_id}")
        print(f"Market dataset ID: {self.market_dataset_id}")
    
    async def push_farm_data(self, farms_data: list, ndvi_data: list, weather_data: list):
        """Push farm-related data to Power BI"""
        
        # Push farm information
        await self.pusher.push_data_to_table(
            self.farm_dataset_id, 
            "FarmData", 
            farms_data
        )
        
        # Push NDVI data
        await self.pusher.push_data_to_table(
            self.farm_dataset_id, 
            "NDVIData", 
            ndvi_data
        )
        
        # Push weather data
        await self.pusher.push_data_to_table(
            self.farm_dataset_id, 
            "WeatherData", 
            weather_data
        )
    
    async def push_market_data(self, prices_data: list, trends_data: list):
        """Push market data to Power BI"""
        
        # Clear existing data (optional)
        await self.pusher.delete_table_rows(self.market_dataset_id, "MarketPrices")
        
        # Push new market prices
        await self.pusher.push_data_to_table(
            self.market_dataset_id, 
            "MarketPrices", 
            prices_data
        )
        
        # Push price trends
        await self.pusher.push_data_to_table(
            self.market_dataset_id, 
            "PriceTrends", 
            trends_data
        )
```

## Frontend Power BI Embedding

```typescript
// powerbi-embed.tsx
import React, { useEffect, useRef } from 'react';
import { models, Report, service } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';

interface PowerBIEmbedProps {
  reportId: string;
  embedUrl: string;
  accessToken: string;
}

export function PowerBIReportEmbed({ reportId, embedUrl, accessToken }: PowerBIEmbedProps) {
  const reportConfig = {
    type: 'report',
    id: reportId,
    embedUrl: embedUrl,
    accessToken: accessToken,
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: true
        },
        pageNavigation: {
          visible: true
        }
      },
      background: models.BackgroundType.Transparent,
      layoutType: models.LayoutType.FitToWidth
    }
  };

  const eventHandlers = new Map([
    ['loaded', () => console.log('Report loaded')],
    ['rendered', () => console.log('Report rendered')],
    ['error', (event: any) => console.error('Report error:', event.detail)]
  ]);

  return (
    <div className="powerbi-embed-container">
      <PowerBIEmbed
        embedConfig={reportConfig}
        eventHandlers={eventHandlers}
        cssClassName="powerbi-report"
        getEmbeddedComponent={(embeddedReport: Report) => {
          // Store report reference for programmatic interactions
          window.report = embeddedReport;
        }}
      />
    </div>
  );
}
```

## Environment Variables for Production

```bash
# Power BI Configuration
POWERBI_CLIENT_ID=your_azure_ad_app_id
POWERBI_CLIENT_SECRET=your_azure_ad_client_secret
POWERBI_TENANT_ID=your_azure_ad_tenant_id
POWERBI_WORKSPACE_ID=your_powerbi_workspace_id

# Power BI API Endpoints
POWERBI_API_BASE_URL=https://api.powerbi.com/v1.0/myorg
POWERBI_AUTH_URL=https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token
POWERBI_SCOPE=https://analysis.windows.net/powerbi/api/.default

# Dataset IDs (created after running setup)
POWERBI_FARM_DATASET_ID=your_farm_dataset_id
POWERBI_MARKET_DATASET_ID=your_market_dataset_id
```

## Production Implementation Checklist

### ✅ Azure Configuration
- [ ] Azure AD app registered with correct permissions
- [ ] Client secret generated and stored securely
- [ ] Power BI admin settings configured
- [ ] Workspace created with service principal access

### ✅ Backend Integration
- [ ] PowerBIAuthenticator class implemented
- [ ] PowerBIDataPusher class implemented
- [ ] Dataset schemas defined and created
- [ ] Error handling and retry logic added

### ✅ Frontend Integration
- [ ] powerbi-client-react package installed
- [ ] Embed components created
- [ ] Access token retrieval implemented
- [ ] Report configurations defined

### ✅ Data Pipeline
- [ ] Scheduled data refresh jobs
- [ ] Data transformation logic
- [ ] Incremental update strategy
- [ ] Monitoring and alerting

### ✅ Security & Compliance
- [ ] Secrets stored in secure vault
- [ ] API rate limiting implemented
- [ ] Audit logging enabled
- [ ] Data encryption in transit/rest

## Monitoring and Troubleshooting

### Common Issues & Solutions

1. **403 Forbidden Error**
   - Check service principal permissions in Power BI admin portal
   - Verify Azure AD app has correct API permissions granted

2. **401 Unauthorized Error**
   - Check if access token is valid and not expired
   - Verify client ID, secret, and tenant ID are correct

3. **Dataset Not Found**
   - Ensure dataset was created successfully
   - Check workspace permissions for the service principal

4. **Data Push Failures**
   - Verify data schema matches table structure
   - Check for row limit violations (10K per request)
   - Validate data types in payload

### Logging and Monitoring

```python
import logging
from datetime import datetime

# Configure comprehensive logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('powerbi_integration.log'),
        logging.StreamHandler()
    ]
)

class PowerBIMonitor:
    def __init__(self):
        self.logger = logging.getLogger('PowerBIIntegration')
    
    def log_data_push(self, dataset_id: str, table_name: str, row_count: int, duration: float):
        self.logger.info(f"Data push completed - Dataset: {dataset_id}, Table: {table_name}, "
                        f"Rows: {row_count}, Duration: {duration:.2f}s")
    
    def log_error(self, operation: str, error: Exception):
        self.logger.error(f"Operation failed: {operation}, Error: {str(error)}")
    
    def log_auth_renewal(self, expires_in: int):
        self.logger.info(f"Access token renewed, expires in {expires_in} seconds")
```

This comprehensive integration guide provides everything needed to transition from the mock Power BI implementation to a fully functional production system with real-time data pushing and report embedding capabilities.