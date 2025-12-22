# Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Azure account with Cosmos DB
- Node.js v18+ on production server
- Docker (optional, for containerization)
- GitHub for CI/CD

---

## 📦 Backend Deployment (Azure App Service)

### 1. Prepare Production Build

```bash
cd backend
npm run build
npm run test
```

### 2. Create Azure App Service

```bash
# Using Azure CLI
az appservice plan create \
  --name restaurant-app-plan \
  --resource-group myResourceGroup \
  --sku B1

az webapp create \
  --resource-group myResourceGroup \
  --plan restaurant-app-plan \
  --name smart-restaurant-api
```

### 3. Configure Environment Variables

In Azure Portal → App Service → Configuration → Application settings:

```
NODE_ENV=production
PORT=8080
COSMOS_DB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_DB_KEY=<your-key>
COSMOS_DB_DATABASE=restaurant_db
JWT_SECRET=<strong-secret-key>
JWT_EXPIRE=7d
SOCKET_IO_URL=https://smart-restaurant-api.azurewebsites.net
```

### 4. Deploy via GitHub Actions

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd backend && npm install
      
      - name: Build
        run: cd backend && npm run build
      
      - name: Test
        run: cd backend && npm test
      
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'smart-restaurant-api'
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
```

---

## 🎨 Frontend Deployment (Azure Static Web Apps)

### 1. Build Production Bundle

```bash
cd frontend
npm run build
```

### 2. Create Static Web App

```bash
az staticwebapp create \
  --name smart-restaurant-ui \
  --resource-group myResourceGroup \
  --source https://github.com/fahamfhm/SEM_4_WEB.git \
  --branch main \
  --location "Central US"
```

### 3. Configure staticwebapp.config.json

```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    },
    {
      "route": "/api/*",
      "rewrite": "http://smart-restaurant-api.azurewebsites.net/api/*"
    }
  ],
  "env": {
    "production": {
      "apiUrl": "https://smart-restaurant-api.azurewebsites.net"
    }
  }
}
```

### 4. GitHub Actions Deployment

Automatically triggered on push to main branch.

---

## 🐳 Docker Containerization (Optional)

### Backend Dockerfile

```dockerfile
# filepath: backend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/server.js"]
```

### Docker Compose

```yaml
# filepath: docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:8080"
    environment:
      NODE_ENV: production
      COSMOS_DB_ENDPOINT: ${COSMOS_DB_ENDPOINT}
      COSMOS_DB_KEY: ${COSMOS_DB_KEY}
    depends_on:
      - cosmos

  frontend:
    build: ./frontend
    ports:
      - "80:3000"
    environment:
      VITE_API_URL: http://backend:8080

  cosmos:
    image: mcr.microsoft.com/cosmosdb/linux/cosmosdb-emulator
    ports:
      - "8081:8081"
```

---

## 🔒 Security Checklist

- ✅ Enable HTTPS/TLS
- ✅ Use environment variables for secrets (never commit to repo)
- ✅ Enable CORS with specific origins
- ✅ Rate limiting on API endpoints
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ JWT token expiration
- ✅ Secure password hashing (bcrypt)
- ✅ HTTPS-only cookies
- ✅ Security headers (HSTS, CSP, X-Frame-Options)

### Express Security Middleware

```typescript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

---

## 📊 Monitoring & Logging

### Application Insights

```bash
npm install applicationinsights
```

```typescript
import appInsights from 'applicationinsights';

appInsights.setup(process.env.APPINSIGHTS_KEY)
  .start();

const client = appInsights.defaultClient;
```

### Monitor Cosmos DB Performance

- Review RU consumption
- Monitor query latency
- Check for hot partitions
- Optimize indexes

---

## 🔄 CI/CD Pipeline

**GitHub Actions Workflow:**
1. Code pushed to main branch
2. Run tests & build
3. Deploy backend to Azure App Service
4. Deploy frontend to Static Web Apps
5. Smoke tests on production
6. Notify on success/failure

---

## 🚨 Rollback Strategy

```bash
# Quick rollback using Azure CLI
az webapp deployment slot swap \
  --resource-group myResourceGroup \
  --name smart-restaurant-api \
  --slot staging
```
