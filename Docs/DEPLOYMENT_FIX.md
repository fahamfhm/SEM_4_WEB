# 🚀 Quick Deployment Fix Guide

## Problem
- CORS error: Backend only accepts requests from `localhost:5173`
- 500/404 errors: Backend not properly configured for Vercel serverless

## Solution

### ✅ What Was Fixed

1. **Updated CORS Configuration** (`backend/src/app.js`)
   - Now accepts multiple origins including production URL
   - Allows `https://food-court-sem4.vercel.app`

2. **Created Vercel Configuration** (`backend/vercel.json`)
   - Proper serverless function setup for Vercel

3. **Updated Server Export** (`backend/server.js`)
   - Exports app for Vercel serverless functions
   - Still works for local development

4. **Created Production Environment** (`frontend/.env.production`)
   - Points to your deployed backend API

## 📋 Next Steps

### 1. Deploy Backend Changes

Push your changes and redeploy the backend:
```bash
git add .
git commit -m "fix: Update CORS configuration for production"
git push origin main
```

The backend at `https://sem-4-web.vercel.app` will automatically redeploy.

### 2. Verify Backend Environment Variables

Go to your backend Vercel project settings and ensure these are set:
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
FRONTEND_URL=https://food-court-sem4.vercel.app
```

**Important:** Make sure your MongoDB connection string:
- Uses MongoDB Atlas (or another hosted MongoDB)
- NOT localhost or local database
- Has correct username/password
- Allows connections from anywhere (0.0.0.0/0) in Network Access

### 3. Redeploy Frontend

The frontend at `https://food-court-sem4.vercel.app` will automatically use the production environment variables on next deployment.

### 4. Test

After both deployments complete:
- Visit `https://food-court-sem4.vercel.app`
- Check browser console for any errors
- Verify menu items load correctly

## 🔧 Alternative: Add More Origins

If you need to allow additional frontend URLs, edit `backend/src/app.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://food-court-sem4.vercel.app',
  'https://your-new-domain.com',  // Add here
  process.env.FRONTEND_URL
].filter(Boolean);
```

## 🐛 Troubleshooting

**Still getting CORS errors?**
1. Check backend is deployed and running
2. Verify environment variables in Vercel dashboard
3. Check Network tab in browser DevTools for actual API URL being called
4. Ensure `withCredentials: true` is set in frontend API configuration

**Backend not responding?**
1. Check Vercel backend logs
2. Verify MongoDB connection string is correct
3. Test backend health: `https://sem-4-web.vercel.app/` should return "API is running 🚀"
4. Ensure MongoDB Atlas allows connections from 0.0.0.0/0

## ✅ Deployment Checklist

### Backend (sem-4-web.vercel.app)
- [ ] `vercel.json` exists in backend root
- [ ] `server.js` exports the app (`export default app`)
- [ ] Environment variables set in Vercel:
  - [ ] `MONGODB_URI` (MongoDB Atlas connection string)
  - [ ] `JWT_SECRET`
  - [ ] `JWT_EXPIRE`
  - [ ] `JWT_COOKIE_EXPIRE`
  - [ ] `FRONTEND_URL`
- [ ] MongoDB Atlas Network Access allows 0.0.0.0/0
- [ ] Test: Visit root URL shows "API is running 🚀"
- [ ] Test: `/api/menu/items` returns menu items (or appropriate auth error)

### Frontend (food-court-sem4.vercel.app)
- [ ] `.env.production` exists with correct API URL
- [ ] Build succeeds (no TypeScript errors)
- [ ] API calls use correct backend URL
- [ ] CORS errors resolved

### After Deployment
- [ ] Menu loads on homepage
- [ ] User registration works
- [ ] User login works
- [ ] Order placement works
- [ ] No console errors
