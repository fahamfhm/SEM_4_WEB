# Authentication System Setup Guide

## 🎉 Successfully Implemented!

Your authentication system is now fully integrated with both frontend and backend!

## ✅ What's Been Created

### **Backend (Node.js/Express)**

1. **User Model** (`backend/src/models/User.js`)
   - User schema with bcrypt password hashing
   - JWT token generation
   - Password comparison method
   - Fields: name, email, password, role, phone, address

2. **Auth Controller** (`backend/src/controllers/authController.js`)
   - Register: `POST /api/auth/register`
   - Login: `POST /api/auth/login`
   - Get Current User: `GET /api/auth/me`
   - Update Profile: `PUT /api/auth/me`
   - Update Password: `PUT /api/auth/updatepassword`
   - Logout: `GET /api/auth/logout`

3. **Auth Middleware** (`backend/src/middleware/auth.js`)
   - `protect`: Verifies JWT token
   - `authorize`: Checks user roles (admin, kitchen, customer)

4. **Auth Routes** (`backend/src/routes/authRoutes.js`)
   - All authentication endpoints configured

### **Frontend (React/TypeScript)**

1. **API Service** (`frontend/src/services/api.ts`)
   - Axios instance with interceptors
   - Automatic token injection
   - 401 error handling

2. **Auth Service** (`frontend/src/services/authService.ts`)
   - Login/Register/Logout methods
   - Token management
   - User data persistence

3. **Auth Context** (`frontend/src/context/AuthContext.tsx`)
   - Global authentication state
   - React hooks: `useAuth()`
   - User management

4. **Updated Components**
   - LoginForm: Connected to backend
   - RegisterForm: Connected to backend
   - Loading states & error handling

## 🚀 How to Use

### **1. Start Backend Server**
```bash
cd backend
npm install  # If you haven't already
node server.js
```

### **2. Start Frontend**
```bash
cd frontend
npm run dev
```

### **3. Test Authentication**

**Register a New User:**
1. Go to `http://localhost:5173/auth/register`
2. Fill in the form:
   - Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
   - Agree to terms
3. Click "Create Account"
4. You'll be redirected to `/customer/menu`

**Login:**
1. Go to `http://localhost:5173/auth/login`
2. Enter email and password
3. Click "Sign In"
4. Redirected based on role:
   - Admin → `/admin/dashboard`
   - Kitchen → `/kitchen/orders`
   - Customer → `/customer/menu`

## 🔐 User Roles

- **customer** (default) - Regular users
- **admin** - Full access
- **kitchen** - Kitchen staff access

## 🔑 Features

✅ Secure password hashing (bcrypt)  
✅ JWT authentication  
✅ Token stored in localStorage  
✅ Auto token injection in API calls  
✅ 401 auto-redirect to login  
✅ Role-based routing  
✅ Password strength indicator  
✅ Form validation  
✅ Error handling  
✅ Loading states  

## 📝 Using Auth in Components

```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔒 Protected API Calls

```typescript
import api from '../services/api';

// Token is automatically added to headers
const response = await api.get('/api/some-protected-route');
```

## ⚙️ Environment Variables

Create `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-db
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## 🎨 What You Get

- Beautiful, modern auth pages
- Smooth animations
- Responsive design
- Professional error messages
- Password strength indicator
- Loading states
- Auto-redirect after login/register

## 🐛 Troubleshooting

**CORS Error?**
- Make sure backend `.env` has correct `FRONTEND_URL`
- Backend should show CORS enabled

**Token not working?**
- Check browser localStorage
- Verify JWT_SECRET in backend `.env`

**Can't login after register?**
- Check MongoDB is running
- Verify user was created in database

## 🎯 Next Steps

1. Add password reset functionality
2. Add email verification
3. Add social login (Google, Facebook)
4. Add remember me functionality
5. Add session timeout
6. Add refresh tokens

---

**Your auth system is production-ready!** 🚀
