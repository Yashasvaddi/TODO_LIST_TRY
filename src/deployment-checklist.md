# Deployment Checklist - Static MVP

## One-Page Deployment Checklist

### Pre-Deployment Verification

#### ✅ **Environment Setup**
- [ ] Docker and Docker Compose installed
- [ ] Node.js 18+ available (for local development)
- [ ] Python 3.11+ available (for local development)
- [ ] Git repository cloned
- [ ] Environment variables configured in `.env`

#### ✅ **Static MVP Configuration**
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts without errors (`uvicorn app:app`)
- [ ] Mock authentication works (any credentials accepted)
- [ ] All mock API endpoints respond correctly
- [ ] Sample data loads in all components

#### ✅ **Docker Deployment**
- [ ] Frontend Docker image builds: `docker build -f Dockerfile.frontend -t agri-frontend .`
- [ ] Backend Docker image builds: `docker build -f Dockerfile.backend -t agri-backend .`
- [ ] Docker Compose starts all services: `docker-compose up -d`
- [ ] Services are healthy: `docker-compose ps`
- [ ] Logs show no critical errors: `docker-compose logs`

#### ✅ **Functional Testing**
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend API docs accessible at http://localhost:8000/docs
- [ ] Login with any credentials succeeds
- [ ] Dashboard displays mock KPIs and charts
- [ ] Map viewer shows farm polygons placeholder
- [ ] Data explorer loads and displays mock tables
- [ ] Power BI reports show embed placeholders
- [ ] Alert manager displays and filters mock alerts

#### ✅ **API Testing**
```bash
# Test mock authentication
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test farm data endpoint
curl http://localhost:8000/api/v1/farms

# Test weather data endpoint  
curl http://localhost:8000/api/v1/weather

# Test alerts endpoint
curl http://localhost:8000/api/v1/alerts

# Test Power BI push endpoint (should log and succeed)
curl -X POST http://localhost:8000/api/v1/powerbi/push \
  -H "Content-Type: application/json" \
  -d '{"datasetId":"test","tableName":"test","rows":[{"test":"data"}]}'
```

#### ✅ **Browser Compatibility**
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (responsive design)

#### ✅ **Performance Check**
- [ ] Frontend loads within 3 seconds
- [ ] API responses under 500ms for mock data
- [ ] No memory leaks in browser dev tools
- [ ] Docker containers use reasonable resources

### Deployment Commands

#### **Quick Start (Recommended)**
```bash
# Clone repository
git clone <repository-url>
cd agri-dashboard

# Start with Docker Compose
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs -f

# Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

#### **Manual Development Setup**
```bash
# Backend setup
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev

# Access at http://localhost:3000
```

### Troubleshooting

#### **Common Issues & Solutions**

1. **Port conflicts**
   ```bash
   # Check what's using ports
   lsof -i :3000
   lsof -i :8000
   
   # Kill processes if needed
   kill -9 <PID>
   ```

2. **Docker build failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Frontend won't start**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Backend API errors**
   ```bash
   # Check Python version
   python --version  # Should be 3.11+
   
   # Reinstall dependencies
   pip install -r requirements.txt --force-reinstall
   ```

5. **Environment variables not loading**
   ```bash
   # Verify .env file exists and has correct format
   cat .env
   
   # Restart services after .env changes
   docker-compose down
   docker-compose up -d
   ```

### Monitoring & Health Checks

#### **Service Health Verification**
```bash
# Check all services status
docker-compose ps

# View real-time logs
docker-compose logs -f

# Check individual service logs
docker-compose logs frontend
docker-compose logs backend

# Check resource usage
docker stats
```

#### **API Health Endpoints**
```bash
# Backend health check
curl http://localhost:8000/health

# Get system info
curl http://localhost:8000/
```

### Security Checklist (Static MVP)

#### ✅ **Development Security**
- [ ] No real credentials in code or environment files
- [ ] Mock JWT secrets used (not production secrets)
- [ ] No sensitive data in mock datasets
- [ ] CORS configured for development origins only
- [ ] API rate limiting disabled (development only)

#### ✅ **Production Preparation Notes**
- [ ] Environment variables template created (`.env.example`)
- [ ] Production secrets placeholder documented
- [ ] Security headers configuration ready
- [ ] Database connection security configured (commented)
- [ ] Authentication system ready for Azure AD integration

### Rollback Plan

#### **Quick Rollback Steps**
```bash
# Stop current deployment
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Pull previous version (if using Git tags)
git checkout <previous-tag>

# Redeploy
docker-compose up -d
```

#### **Data Backup (Production)**
```bash
# Note: Static MVP uses no persistent data
# For production, add these backup steps:
# docker exec postgres pg_dump -U postgres agridb > backup.sql
# docker exec mongo mongodump --db agridb --out /backup/
```

### Next Steps for Production

#### **Immediate Post-Deployment Actions**
- [ ] Document any deployment-specific configurations
- [ ] Set up monitoring and alerting
- [ ] Configure backup procedures
- [ ] Plan production migration timeline
- [ ] Schedule security review

#### **Production Migration Preparation**
- [ ] Uncomment database services in docker-compose.yml
- [ ] Replace mock authentication with Azure AD
- [ ] Configure real Power BI integration
- [ ] Set up production environment variables
- [ ] Implement proper error handling and logging
- [ ] Configure SSL/TLS certificates
- [ ] Set up CI/CD pipeline

### Support Contacts

**Technical Issues:**
- Check logs first: `docker-compose logs`
- Review API documentation: http://localhost:8000/docs
- Verify sample data structure in `/sample-data.json`

**Deployment Issues:**
- Ensure Docker has sufficient resources (4GB+ RAM recommended)
- Check firewall settings for ports 3000 and 8000
- Verify no other services using the same ports

This checklist ensures a smooth deployment of the static MVP while preparing the foundation for production migration.