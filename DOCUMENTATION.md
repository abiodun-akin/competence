# Competence Planning Tool - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Installation & Setup](#installation--setup)
5. [User Guide](#user-guide)
6. [API Documentation](#api-documentation)
7. [Technical Implementation](#technical-implementation)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The **Competence Planning Tool** is a comprehensive full-stack web application designed for managing operator competencies, standards, teams, and planning operator rotations in manufacturing or industrial environments. The system provides intelligent workload balancing through automated rotation suggestions and comprehensive analytics.

### Key Benefits
- **Centralized Management**: Single source of truth for all competency data
- **Intelligent Planning**: Automated rotation suggestions based on workload analysis
- **Real-time Analytics**: Visual insights into operator utilization and performance
- **Scalable Architecture**: Docker-based deployment for easy scaling
- **Modern UI**: Responsive, intuitive interface for all user roles

---

## Architecture

### Technology Stack
- **Frontend**: React 18 with Vite, Modern CSS, Responsive Design
- **Backend**: Node.js with Express.js, RESTful API
- **Database**: MongoDB (with in-memory fallback for demo)
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (for frontend serving)

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React/Nginx) │◄──►│  (Node.js/API)  │◄──►│   (MongoDB)     │
│   Port: 8080    │    │   Port: 3000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Interaction** → Frontend React Components
2. **API Calls** → Backend Express Routes
3. **Data Processing** → Business Logic & Validation
4. **Data Storage** → MongoDB Collections
5. **Response** → JSON API Response
6. **UI Update** → React State Management

---

## Features

### 1. Authentication System
- **Multi-role Support**: Admin, Manager, Operator roles
- **Secure Login**: Token-based authentication
- **Session Management**: Automatic logout and session handling

### 2. Setup Management
- **Standards Management**: Define work standards with criticality levels
- **Team Management**: Organize operators into teams
- **Competencies Management**: Define skill categories
- **Qualifications Management**: Set proficiency levels (Basic, Qualified, Expert)

### 3. Operator Management
- **Operator Profiles**: Complete operator information
- **Competency Tracking**: Skills and experience levels
- **Team Assignment**: Flexible team membership
- **Status Management**: Active/Inactive operator states

### 4. Planning System
- **Weekly Planning**: Assign operators to standards by week
- **Visual Calendar**: Easy-to-use planning interface
- **Assignment Tracking**: Monitor operator workloads
- **Historical Data**: Track planning over time

### 5. Rotation Management
- **Manual Rotations**: Create custom operator rotations
- **Auto-Suggestions**: AI-powered rotation recommendations
- **Workload Balancing**: Automatic detection of overloaded operators
- **Approval Workflow**: Pending/Approved rotation status

### 6. Analytics & Reporting
- **Operator Utilization**: Visual utilization rates and trends
- **Standard Usage**: Track which standards are most used
- **Competency Analysis**: Skills distribution across teams
- **Performance Metrics**: Key performance indicators

---

## Installation & Setup

### Prerequisites
- Docker Desktop installed
- Git for version control
- 8GB+ RAM recommended
- Modern web browser

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd competence1

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:8080
# Backend API: http://localhost:3000
```

### Development Setup
```bash
# Backend development
cd backend
npm install
npm run dev

# Frontend development (separate terminal)
cd frontend
npm install
npm run dev
```

### Environment Configuration
Create `.env` files for custom configuration:

**Backend (.env)**
```
PORT=3000
MONGODB_URI=mongodb://mongo:27017/competence
NODE_ENV=development
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000
```

---

## User Guide

### Getting Started

#### 1. Login
- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Operator**: `operator` / `operator123`

#### 2. Initial Setup
1. Navigate to **Setup** page
2. Configure **Standards** (work processes)
3. Set up **Teams** (organizational units)
4. Define **Competencies** (skill categories)
5. Create **Qualifications** (proficiency levels)

### Core Workflows

#### Setting Up Standards
1. Go to Setup → Standards tab
2. Click "Add" and enter standard name
3. Set department and criticality level
4. Standards are immediately available system-wide

#### Managing Operators
1. Navigate to **Operators** page
2. Click "Add Operator"
3. Fill in operator details:
   - Name and contact information
   - Team assignment
   - Competencies and skill levels
   - Years of experience per skill
4. Save to create operator profile

#### Weekly Planning
1. Go to **Planning** page
2. Select week and year
3. For each assignment:
   - Choose operator from dropdown
   - Select standard from dropdown
   - Set number of days (1-5)
4. Save assignments

#### Managing Rotations
1. Navigate to **Rotation** page
2. **Manual Rotation**:
   - Select "From" and "To" operators
   - Choose standard to rotate
   - Add reason and scheduled date
   - Submit rotation
3. **Auto-Suggestions**:
   - Click "Generate Auto-Suggestions"
   - Review suggested rotations
   - Accept suggestions to pre-fill form
   - Submit approved rotations

#### Viewing Analytics
1. Go to **Analytics** page
2. Review operator utilization rates
3. Analyze standard usage patterns
4. Identify overloaded operators
5. Use insights for planning decisions

---

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with username and password
```json
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "base64-encoded-token",
  "user": {
    "id": "1",
    "username": "admin",
    "role": "admin"
  }
}
```

#### POST /api/auth/logout
Logout current user
```json
Response:
{
  "success": true
}
```

### Operator Endpoints

#### GET /api/operators
Get all operators
```json
Response: [
  {
    "_id": "1",
    "name": "John Smith",
    "team": "Team A",
    "competences": [
      {
        "standard": "Welding",
        "level": "expert",
        "yearsExperience": 8
      }
    ],
    "status": "active",
    "totalAssignments": 12
  }
]
```

#### POST /api/operators
Create new operator
```json
Request:
{
  "name": "New Operator",
  "team": "Team A",
  "competences": [
    {
      "standard": "Welding",
      "level": "basic",
      "yearsExperience": 1
    }
  ]
}
```

#### PUT /api/operators/:id
Update operator
#### DELETE /api/operators/:id
Delete operator

### Setup Endpoints

#### GET /api/setup/standards
Get all standards
#### POST /api/setup/standards
Create new standard
#### PUT /api/setup/standards/:id
Update standard
#### DELETE /api/setup/standards/:id
Delete standard

#### GET /api/setup/teams
Get all teams
#### POST /api/setup/teams
Create new team
#### PUT /api/setup/teams/:id
Update team
#### DELETE /api/setup/teams/:id
Delete team

#### GET /api/setup/competencies
Get all competencies
#### POST /api/setup/competencies
Create new competency
#### PUT /api/setup/competencies/:id
Update competency
#### DELETE /api/setup/competencies/:id
Delete competency

#### GET /api/setup/qualifications
Get all qualifications
#### POST /api/setup/qualifications
Create new qualification
#### PUT /api/setup/qualifications/:id
Update qualification
#### DELETE /api/setup/qualifications/:id
Delete qualification

### Planning Endpoints

#### GET /api/planning/weeks/:week/:year
Get weekly assignments
```json
Response:
{
  "_id": "w2026-01",
  "week": 1,
  "year": 2026,
  "date": "2026-01-06",
  "assignments": [
    {
      "operatorId": "1",
      "standard": "Welding",
      "days": 5,
      "rotationScore": 0.2
    }
  ]
}
```

#### PUT /api/planning/weeks/:week/:year
Update weekly assignments

### Rotation Endpoints

#### GET /api/rotation
Get all rotations
#### POST /api/rotation
Create new rotation
#### PUT /api/rotation/:id
Update rotation
#### DELETE /api/rotation/:id
Delete rotation

#### POST /api/rotation/auto/generate
Generate automatic rotation suggestions
```json
Response: [
  {
    "fromOperatorId": "2",
    "fromName": "Jane Doe",
    "toOperatorId": "1",
    "toName": "John Smith",
    "standard": "Assembly",
    "reason": "Workload balancing - high utilization detected",
    "isAutomatic": true,
    "priority": "high"
  }
]
```

### Analytics Endpoints

#### GET /api/analytics/rotation
Get operator utilization analytics
```json
Response: [
  {
    "operatorId": "1",
    "name": "John Smith",
    "totalAssignments": 12,
    "utilizationRate": 55,
    "competenceCount": 2
  }
]
```

#### GET /api/analytics/standards
Get standards usage analytics
```json
Response: [
  {
    "standard": "Welding",
    "totalDays": 5,
    "operatorCount": 2,
    "criticality": "high"
  }
]
```

---

## Technical Implementation

### Frontend Architecture

#### Component Structure
```
src/
├── components/
│   ├── Layout.jsx          # Main layout wrapper
│   └── Navigation.jsx      # Navigation menu
├── pages/
│   ├── LoginPage.jsx       # Authentication
│   ├── SetupPage.jsx       # System configuration
│   ├── OperatorsPage.jsx   # Operator management
│   ├── PlanningPage.jsx    # Weekly planning
│   ├── RotationPage.jsx    # Rotation management
│   └── AnalyticsPage.jsx   # Analytics dashboard
├── App.jsx                 # Main application
└── main.jsx               # Entry point
```

#### State Management
- **React Hooks**: useState, useEffect for local state
- **Props Drilling**: Simple parent-child data flow
- **API Integration**: Fetch-based HTTP client
- **Form Handling**: Controlled components

#### Styling Approach
- **Modern CSS**: Custom CSS with CSS Grid and Flexbox
- **Responsive Design**: Mobile-first approach
- **Component Styling**: Scoped styles per component
- **Theme Consistency**: Consistent color scheme and typography

### Backend Architecture

#### Route Organization
```
server.js
├── Authentication routes    # /api/auth/*
├── Operator routes         # /api/operators/*
├── Setup routes           # /api/setup/*
├── Planning routes        # /api/planning/*
├── Rotation routes        # /api/rotation/*
└── Analytics routes       # /api/analytics/*
```

#### Data Models

**Operator Model**
```javascript
{
  _id: String,
  name: String,
  team: String,
  competences: [{
    standard: String,
    level: String,
    yearsExperience: Number
  }],
  status: String,
  totalAssignments: Number
}
```

**Standard Model**
```javascript
{
  _id: String,
  name: String,
  department: String,
  criticality: String
}
```

**Weekly Assignment Model**
```javascript
{
  _id: String,
  week: Number,
  year: Number,
  date: String,
  assignments: [{
    operatorId: String,
    standard: String,
    days: Number,
    rotationScore: Number
  }]
}
```

#### Business Logic

**Auto-Rotation Algorithm**
1. Identify operators with high assignment counts (≥14)
2. Find operators with matching competencies
3. Calculate workload differences
4. Generate rotation suggestions with priority levels
5. Return ranked suggestions for approval

**Utilization Calculation**
- Base calculation: `totalAssignments * 4.6` (weeks per assignment)
- Capped at 100% maximum utilization
- Used for workload balancing decisions

### Database Design

#### Collections
- **operators**: Operator profiles and competencies
- **standards**: Work standards and requirements
- **weeklyAssignments**: Planning data by week
- **rotations**: Rotation requests and history
- **users**: Authentication data
- **setup**: Configuration data (teams, competencies, qualifications)

#### Indexing Strategy
- Primary keys on `_id` fields
- Compound indexes on week/year for planning queries
- Text indexes on name fields for search functionality

---

## Deployment

### Production Deployment

#### Docker Compose Production
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
  
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/competence
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=competence

volumes:
  mongo_data:
```

#### Environment Variables
```bash
# Production environment
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://mongo:27017/competence
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-domain.com
```

#### SSL/HTTPS Setup
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://frontend:80;
    }
    
    location /api {
        proxy_pass http://backend:3000;
    }
}
```

### Scaling Considerations

#### Horizontal Scaling
- **Load Balancer**: Nginx or cloud load balancer
- **Multiple Backend Instances**: Scale backend containers
- **Database Clustering**: MongoDB replica sets
- **CDN Integration**: Static asset delivery

#### Performance Optimization
- **Caching**: Redis for session and data caching
- **Database Optimization**: Proper indexing and query optimization
- **Asset Optimization**: Minification and compression
- **API Rate Limiting**: Prevent abuse and ensure stability

---

## Troubleshooting

### Common Issues

#### 1. Container Startup Issues
**Problem**: Containers fail to start
**Solution**:
```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose up --build
```

#### 2. API Connection Issues
**Problem**: Frontend cannot connect to backend
**Solution**:
- Verify backend is running on port 3000
- Check CORS configuration
- Ensure network connectivity between containers

#### 3. Database Connection Issues
**Problem**: Backend cannot connect to MongoDB
**Solution**:
```bash
# Check MongoDB container
docker-compose logs mongo

# Verify connection string
MONGODB_URI=mongodb://mongo:27017/competence
```

#### 4. Frontend Build Issues
**Problem**: Frontend fails to build
**Solution**:
```bash
cd frontend
npm install
npm run build

# Check for dependency issues
npm audit fix
```

### Performance Issues

#### 1. Slow API Responses
- Check database query performance
- Add appropriate indexes
- Implement caching strategies
- Optimize data serialization

#### 2. High Memory Usage
- Monitor container resource usage
- Implement pagination for large datasets
- Optimize React component rendering
- Use production builds

### Debugging Tools

#### Backend Debugging
```bash
# Enable debug logging
DEBUG=app:* npm start

# Monitor API requests
curl -X GET http://localhost:3000/api/health
```

#### Frontend Debugging
- Browser Developer Tools
- React Developer Tools extension
- Network tab for API monitoring
- Console logging for state debugging

---

## Maintenance & Updates

### Regular Maintenance Tasks
1. **Database Backups**: Regular MongoDB backups
2. **Log Rotation**: Manage application logs
3. **Security Updates**: Keep dependencies updated
4. **Performance Monitoring**: Track system metrics
5. **User Feedback**: Collect and implement improvements

### Update Procedures
1. **Code Updates**: Git-based deployment
2. **Database Migrations**: Schema update scripts
3. **Container Updates**: Rebuild and redeploy
4. **Testing**: Comprehensive testing before production
5. **Rollback Plan**: Quick rollback procedures

---

## Support & Contact

For technical support or questions:
- **Documentation**: This comprehensive guide
- **Issue Tracking**: GitHub Issues
- **Email Support**: [support-email]
- **Training**: Available upon request

---

*Last Updated: February 2026*
*Version: 1.0.0*