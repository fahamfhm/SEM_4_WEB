# Vercel Deployment Fix Guide

## Issues Identified
Your 404 errors on Vercel are caused by:
1. **Frontend SPA Routing**: React Router needs all routes to redirect to `index.html`
2. **API URL Configuration**: Frontend needs correct backend URL in production
3. **Backend Route Handling**: API routes need proper configuration

## Solution Implemented

### 1. Frontend Vercel Configuration (`frontend/vercel.json`)
Created configuration for proper SPA routing and asset caching.

### 2. Backend Vercel Configuration (`backend/vercel.json`)
Updated to handle API routes and uploads properly with explicit route matching.

### 3. Environment Variables
Your `.env.production` already has the backend URL configured.

## Deployment Steps

### Deploy Backend First:
```bash
cd backend
vercel --prod
```
**Note the deployed URL** (e.g., `https://your-backend.vercel.app`)

### Update Frontend Environment:
1. Open `frontend/.env.production`
2. Update `VITE_API_URL` with your backend URL:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```

### Deploy Frontend:
```bash
cd frontend
vercel --prod
```

## Vercel Dashboard Configuration

### For Backend Project:
1. Go to Vercel Dashboard → Your Backend Project → Settings
2. **Environment Variables**: Add these if not already set
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```

### For Frontend Project:
1. Go to Vercel Dashboard → Your Frontend Project → Settings
2. **Environment Variables**: Add
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   ```
3. **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Troubleshooting 404 Errors

### If you still get 404 on routes (e.g., `/menu`, `/profile`):
1. **Check Vercel Build Logs**: Ensure no build errors
2. **Verify vercel.json is deployed**: Check in Vercel dashboard file browser
3. **Clear Vercel Cache**: Redeploy with "Clear cache and deploy"

### If API calls fail:
1. **Check CORS**: Backend should allow your frontend domain
2. **Verify Environment Variables**: Check in Vercel dashboard
3. **Test API directly**: Visit `https://your-backend.vercel.app/api/health`

### If images/assets 404:
1. **Check Build Output**: Ensure `dist/assets` folder exists
2. **Verify Paths**: Use relative paths, not absolute (`/assets/...` not `C:/...`)
3. **Public Folder**: Move static assets to `frontend/public/`

## Quick Fix Commands

### Redeploy Everything:
```bash
# Backend
cd backend
vercel --prod

# Frontend (update .env.production first!)
cd ../frontend
vercel --prod
```

### Force Fresh Deploy:
```bash
vercel --prod --force
```

## Files Modified
- ✅ `frontend/vercel.json` - Created with SPA routing
- ✅ `backend/vercel.json` - Updated with proper API routes
- ✅ `frontend/.env.production` - Already configured (verify backend URL is correct)

## Next Steps
1. **Deploy backend** and note the URL
2. **Update** `frontend/.env.production` with correct backend URL
3. **Deploy frontend**
4. **Test** all routes in production
5. If issues persist, check Vercel function logs in dashboard
