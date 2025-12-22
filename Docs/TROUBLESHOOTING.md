# Troubleshooting Guide

## 🐛 Common Issues & Solutions

### Backend Issues

#### Port 5000 Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution (Windows):**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Solution (macOS/Linux):**
```bash
lsof -ti:5000 | xargs kill -9
```

---

#### Cosmos DB Connection Failed
**Error:** `Error: connect ENOTFOUND your-account.documents.azure.com`

**Solutions:**
1. Verify connection string in `.env`
2. Check firewall: Allow your IP in Cosmos DB → Networking
3. For Emulator: Ensure it's running and endpoint is correct
4. Test with Azure Cosmos DB Explorer

```bash
# Test connection
node -e "
const { CosmosClient } = require('@azure/cosmos');
const client = new CosmosClient({
  endpoint: process.env.COSMOS_DB_ENDPOINT,
  key: process.env.COSMOS_DB_KEY
});
client.databases.readAll().toArray()
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Failed:', err));
"
```

---

#### JWT Token Issues
**Error:** `JsonWebTokenError: invalid token`

**Solutions:**
1. Check JWT_SECRET matches between requests
2. Verify token hasn't expired
3. Ensure token format: `Bearer <token>`

```typescript
// Debug token
import jwt from 'jsonwebtoken';
const decoded = jwt.decode(token);
console.log(decoded);
```

---

#### CORS Errors
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Update `server.ts`:
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
```

---

### Frontend Issues

#### API Requests Failing
**Error:** `401 Unauthorized` or `404 Not Found`

**Solutions:**
1. Check `VITE_API_URL` in `.env` matches backend URL
2. Verify token is being sent: DevTools → Network → Headers
3. Check backend is running: `curl http://localhost:5000/health`

---

#### WebSocket Connection Failed
**Error:** `WebSocket is closed before the connection is established`

**Solutions:**
```typescript
// Check Socket.IO connection
const socket = io(import.meta.env.VITE_SOCKET_IO_URL, {
  auth: { token: getToken() },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

socket.on('connect_error', (error) => {
  console.error('Socket error:', error);
});
```

---

#### Blank Page / White Screen
**Error:** Application loads but shows nothing

**Solutions:**
1. Check browser console for errors (F12)
2. Verify `public/index.html` exists
3. Check Vite configuration: `vite.config.ts`
4. Clear cache: `npm cache clean --force`

```bash
# Rebuild from scratch
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Database Issues

#### Orders Not Updating in Real-Time
**Solution:** Verify Cosmos DB change feed is enabled
```bash
# Check container settings
az cosmosdb sql container show \
  --resource-group myResourceGroup \
  --account-name myAccount \
  --database-name restaurant_db \
  --name orders
```

---

#### High RU Consumption
**Problem:** Unexpected spike in Request Units

**Investigation:**
1. Check query patterns in Cosmos DB Insights
2. Review index usage
3. Monitor large batch operations
4. Check for inefficient queries

**Optimization:**
```typescript
// Use continuation tokens for pagination
const iterator = container.items
  .query('SELECT * FROM c WHERE c.customerId = @customerId', {
    parameters: [{ name: '@customerId', value: userId }]
  })
  .getAsyncIterator();

const { resources, continuationToken } = await iterator.fetchNext();
```

---

## 🧪 Testing Endpoints

### Using cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Get menu items
curl http://localhost:5000/api/menu/items \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Import API collection
2. Set `{{BASE_URL}}` to `http://localhost:5000/api`
3. Set `{{TOKEN}}` from login response
4. Use in headers: `Authorization: Bearer {{TOKEN}}`

---

## 📋 Diagnostic Checklist

**Before reporting issues:**
- ✅ Check `.env` files are correctly configured
- ✅ Verify all environment variables are set
- ✅ Ensure database is running (Cosmos/MongoDB)
- ✅ Check ports aren't in use
- ✅ Review browser console for errors
- ✅ Check network requests in DevTools
- ✅ Verify JWT tokens are valid
- ✅ Test with fresh browser session (incognito mode)

---

## 📞 Getting Help

1. Check this troubleshooting guide first
2. Review error logs: `backend/logs/error.log`
3. Check GitHub Issues: https://github.com/fahamfhm/SEM_4_WEB/issues
4. Contact development team with:
   - Exact error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
