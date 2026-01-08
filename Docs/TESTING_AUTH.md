## Quick Test Guide

### Test Your Authentication System

#### 1. **Test Backend API**
Open your browser or Postman:

**Check Server:**
```
GET http://localhost:5000/
Response: "API is running 🚀"
```

**Register Test User:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Login Test User:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### 2. **Test Frontend**

1. Open `http://localhost:5173/auth/register`
2. Create an account:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "test123456"
   - Confirm Password: "test123456"
   - ✓ Agree to terms
3. Click "Create Account"
4. Should redirect to `/customer/menu`

#### 3. **Test Login**

1. Go to `http://localhost:5173/auth/login`
2. Enter credentials:
   - Email: "john@example.com"
   - Password: "test123456"
3. Click "Sign In"
4. Should redirect based on role

#### 4. **Check Browser Console**

Open DevTools (F12) → Console tab to see:
- API requests
- Responses
- Any errors

#### 5. **Check localStorage**

DevTools → Application → Local Storage → `http://localhost:5173`
Should see:
- `token`: JWT token string
- `user`: User object JSON

#### 6. **Test Logout**

Add a logout button to test:
```tsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { logout } = useAuth();
  
  return <button onClick={logout}>Logout</button>;
}
```

### Common Test Scenarios

✅ **Register new user** - Works  
✅ **Login existing user** - Works  
✅ **Token stored** - Check localStorage  
✅ **Protected routes** - Should redirect if not authenticated  
✅ **Role-based redirect** - Admin/Kitchen/Customer routing  
✅ **Invalid credentials** - Shows error message  
✅ **Duplicate email** - Shows error message  
✅ **Weak password** - Shows strength indicator  

### Test Users (After Creating)

You can create test users with different roles:

**Admin User:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

**Kitchen User:**
```json
{
  "name": "Kitchen Staff",
  "email": "kitchen@example.com",
  "password": "kitchen123",
  "role": "kitchen"
}
```

**Customer User:**
```json
{
  "name": "Regular Customer",
  "email": "customer@example.com",
  "password": "customer123"
}
```

### Verify in Database

```bash
# Connect to MongoDB
mongosh

# Use database
use restaurant-db

# See all users
db.users.find().pretty()

# Find specific user
db.users.findOne({ email: "test@example.com" })
```

### Success Indicators

✅ Backend shows: "Server running on port 5000"  
✅ Backend shows: "MongoDB Connected"  
✅ Login form shows loading state  
✅ Successful login redirects to appropriate page  
✅ Token appears in localStorage  
✅ No CORS errors in console  
✅ Error messages display for invalid input  

---

**Everything is working if you can successfully register, login, and see your user data!** 🎉
