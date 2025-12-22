# Setup & Installation Guide

## 📋 Prerequisites

- **Node.js** v18+ and npm v9+
- **Azure Cosmos DB** account (or local MongoDB)
- **Git** for version control
- **VS Code** with extensions (optional but recommended)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/fahamfhm/SEM_4_WEB.git
cd SEM_4_WEB
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables

Create `.env` file in backend directory:

```env
# Server
NODE_ENV=development
PORT=5000

# Database (Choose one)
# Option A: Azure Cosmos DB
COSMOS_DB_ENDPOINT=https://your-account.documents.azure.com:443/
COSMOS_DB_KEY=your-primary-key
COSMOS_DB_DATABASE=restaurant_db

# Option B: MongoDB
MONGODB_URI=mongodb://localhost:27017/restaurant_db

# JWT & Auth
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Email Service (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxx

# Socket.IO
SOCKET_IO_URL=http://localhost:5000
```

#### Initialize Database

```bash
# For Cosmos DB Emulator
npm run seed:cosmos

# For MongoDB
npm run seed:mongo
```

#### Start Backend Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_IO_URL=http://localhost:5000
VITE_APP_NAME=Smart Restaurant
```

#### Start Development Server

```bash
npm run dev
```

App runs on `http://localhost:5173`

---

## 🏗️ Folder Structure Setup

```
SEM_4_WEB/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── errors/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── types/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env
└── Docs/
```

---

## 🗄️ Database Setup

### Using Azure Cosmos DB Emulator

1. **Download & Install:** [Cosmos DB Emulator](https://learn.microsoft.com/azure/cosmos-db/emulator)

2. **Start Emulator:**
   ```bash
   # Windows
   CosmosDB.Emulator.exe
   ```

3. **Connection String:**
   ```
   AccountEndpoint=https://localhost:8081/;AccountKey=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPbZLYMEqZY7yp6QQbZKKIQ==
   ```

4. **VS Code Extension:**
   - Install `Azure Cosmos DB` extension
   - Connect to local emulator
   - Create database & containers

### Using MongoDB

1. **Install MongoDB:**
   ```bash
   # Windows (via Chocolatey)
   choco install mongodb-community
   ```

2. **Start MongoDB:**
   ```bash
   mongod --dbpath="C:\data\db"
   ```

3. **Connection String:**
   ```
   mongodb://localhost:27017/restaurant_db
   ```

---

## 🧪 Verification

### Backend Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "database": "connected"
}
```

### Frontend Verification

Open browser: `http://localhost:5173`
- Home page loads
- Can navigate menu
- API calls succeed (check DevTools)

---

## 📦 Build for Production

### Backend Build

```bash
cd backend
npm run build
npm start
```

### Frontend Build

```bash
cd frontend
npm run build
npm preview
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Database Connection Issues
- Verify `.env` credentials
- Check firewall settings
- For Cosmos DB: Enable public endpoint access

### CORS Errors
- Ensure `VITE_API_URL` matches backend URL
- Check Express CORS middleware configuration

---