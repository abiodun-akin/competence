# Render Deployment Guide with MongoDB Atlas

## Prerequisites
1. **MongoDB Atlas Account**: Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **GitHub Repository**: Your code pushed to GitHub
3. **Render Account**: Sign up at [render.com](https://render.com)

## Step 1: Setup MongoDB Atlas (Free Tier)
1. Create a new cluster (M0 Sandbox - FREE)
2. Create a database user:
   - Username: `competence-user`
   - Password: Generate secure password
3. Add IP addresses to whitelist:
   - Add `0.0.0.0/0` (allow from anywhere)
4. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## Step 2: Backend Deployment
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
   - `MONGODB_URI`: `your-atlas-connection-string`
7. Deploy

## Step 3: Frontend Deployment
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

## Step 4: Update Frontend API URL
After backend deployment, update the frontend environment variable:
- Go to frontend service settings
- Update `VITE_API_URL` with your actual backend URL
- Redeploy frontend

## MongoDB Atlas Connection String Format
```
mongodb+srv://competence-user:<password>@cluster0.xxxxx.mongodb.net/competence?retryWrites=true&w=majority
```

## Features with MongoDB Integration
- **Persistent Data**: All data survives app restarts
- **Automatic Fallback**: Uses in-memory data if MongoDB fails
- **Sample Data**: Automatically populates collections on first run
- **Production Ready**: Optimized for cloud deployment

## Free Tier Limitations
- **Render**: Backend sleeps after 15 minutes, 750 hours/month
- **MongoDB Atlas**: 512MB storage, shared cluster
- **Cold Starts**: 10-30 second delays after sleep

## URLs After Deployment
- **Frontend**: `https://competence-frontend.onrender.com`
- **Backend**: `https://competence-backend.onrender.com`
- **Database**: MongoDB Atlas cluster

## Testing Deployment
1. Visit frontend URL
2. Login with: `admin` / `admin123`
3. Add/edit data to test MongoDB persistence
4. Check backend logs for MongoDB connection status

## Troubleshooting
- **MongoDB Connection**: Check connection string and IP whitelist
- **Environment Variables**: Verify all variables are set correctly
- **Service Logs**: Check Render dashboard for error messages
- **CORS Issues**: Ensure frontend URL is in CORS configuration

## Local Development with MongoDB
```bash
# Set environment variable
export MONGODB_URI="your-atlas-connection-string"

# Start backend
cd backend
npm start
```