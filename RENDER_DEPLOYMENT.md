# Render Deployment Guide

## Quick Deployment Steps

### 1. Backend Deployment
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder as root directory
5. Configure:
   - **Name**: `competence-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (auto-set by Render)
7. Deploy

### 2. Frontend Deployment
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Select the `frontend` folder as root directory
4. Configure:
   - **Name**: `competence-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: `https://competence-backend.onrender.com`
6. Deploy

### 3. Update Frontend API URL
After backend deployment, update the frontend environment variable:
- Go to frontend service settings
- Update `VITE_API_URL` with your actual backend URL
- Redeploy frontend

## Free Tier Limitations
- Backend sleeps after 15 minutes of inactivity
- 750 hours/month limit
- Cold start delays (10-30 seconds)

## URLs After Deployment
- **Frontend**: `https://competence-frontend.onrender.com`
- **Backend**: `https://competence-backend.onrender.com`

## Testing Deployment
1. Visit frontend URL
2. Login with: `admin` / `admin123`
3. Test all features to ensure API connectivity

## Troubleshooting
- Check service logs in Render dashboard
- Verify environment variables
- Ensure CORS is properly configured
- Check API URL in frontend environment