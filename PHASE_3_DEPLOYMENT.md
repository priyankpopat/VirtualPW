# Phase 3: Admin Dashboard & Deployment Guide

## 🎯 Phase 3 Complete Features

### 1. Admin Dashboard (`admin.html`)
- **Real-time Statistics**
  - Total votes cast
  - Total registered users
  - Leading party
  - Election status
  
- **Vote Analytics**
  - Bar chart showing vote distribution
  - Party-wise vote counts and percentages
  - Leading party calculation
  
- **Audit Log**
  - Complete vote history with pagination
  - Voter name, email, party, timestamp
  - Search and filter capabilities
  
- **Danger Zone**
  - Reset election (admin only)
  - Permanently delete all votes
  - Requires confirmation

### 2. Admin Routes (`/api/admin/*`)
All routes require JWT token with admin role:

```
GET  /api/admin/stats           → Dashboard statistics
GET  /api/admin/votes           → All votes with details
GET  /api/admin/votes/timeline  → Vote timeline data
GET  /api/admin/users           → All registered users
GET  /api/admin/audit-log       → Complete audit trail (paginated)
POST /api/admin/reset           → Reset election (DANGEROUS)
POST /api/admin/create-admin    → Create new admin user
```

### 3. Security Features
- ✅ **Rate Limiting**: 100 requests per 15 minutes per IP
- ✅ **JWT Authentication**: Required for all sensitive operations
- ✅ **Role-Based Access**: Admin routes restricted to admin users
- ✅ **Password Hashing**: Bcryptjs with 10 salt rounds
- ✅ **CORS Protection**: Configurable origins
- ✅ **One Vote Per User**: Database constraints prevent duplicates

### 4. Admin Dashboard Link
- Appears in sidebar only for admin users
- Quick access from dashboard.html
- Shows "Admin Panel" with shield icon

---

## 🚀 Production Deployment

### Overview
```
┌─────────────────┐
│  Frontend       │  Deployed on Vercel
│  (React/HTML)   │  vercel.com
└────────┬────────┘
         │
         │ API calls
         │ (https://api.yourdomain.com)
         ▼
┌─────────────────┐
│  Backend        │  Deployed on Railway or Render
│  (Node + Express)
└────────┬────────┘
         │
         │ Database connection
         │
         ▼
┌─────────────────┐
│  MongoDB Atlas  │  Cloud database
│  (Database)     │  mongodb.com
└─────────────────┘
```

---

## 📋 Deployment Checklist

### Step 1: Prepare MongoDB Atlas
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free tier account
3. Create new cluster (M0 Free)
4. Create database "election-assistant"
5. Create user with password
6. Whitelist all IPs (0.0.0.0/0)
7. Get connection string: mongodb+srv://user:pass@cluster.mongodb.net/election-assistant
```

### Step 2: Deploy Backend (Railway)

#### Via Railway CLI:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd backend
railway init

# Add environment variables
railway variables set MONGODB_URI "your_mongodb_url"
railway variables set JWT_SECRET "your_jwt_secret_key"
railway variables set PORT 5000

# Deploy
railway up
```

#### Get Backend URL:
```bash
railway logs  # Find your deployed URL
# Output: https://election-api-production.railway.app
```

### Step 3: Create First Admin User

```bash
# Run on deployed backend (Railway terminal)
node create-admin.js "Admin Name" "admin@example.com" "YourPassword123"

# Or locally (if testing)
cd backend
npm install  # If not done
MONGODB_URI="your_mongodb_url" node create-admin.js
```

### Step 4: Deploy Frontend (Vercel)

#### Option A: Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd election-assistant
vercel
```

#### Option B: Via GitHub
```
1. Push code to GitHub
2. Go to vercel.com
3. Import project from GitHub
4. Deploy
```

### Step 5: Update API URL

Update `api-client.js` with production backend URL:

```javascript
const API_URL = 'https://election-api-production.railway.app/api';
```

### Step 6: Set Environment Variables (Frontend)

In Vercel dashboard:
```
REACT_APP_API_URL = https://election-api-production.railway.app/api
```

---

## 🔧 Alternative: Deploy Backend on Render

### Step 1: Connect Repository
```
1. Go to render.com
2. Create account
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Select branch: main
```

### Step 2: Configure Service
```
Name: election-assistant-api
Environment: Node
Build Command: npm install
Start Command: node server.js
```

### Step 3: Add Environment Variables
```
MONGODB_URI: your_mongodb_url
JWT_SECRET: your_jwt_secret_key
NODE_ENV: production
```

### Step 4: Deploy
- Click "Deploy Web Service"
- Wait for build to complete
- Get production URL: `https://election-assistant-api.onrender.com`

---

## 🔑 Environment Variables

### Backend (.env)
```
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/election-assistant
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_chars
NODE_ENV=production
PORT=5000

# Optional
FRONTEND_URL=https://yourdomain.vercel.app
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env or hardcoded in api-client.js)
```
VITE_API_URL=https://election-api-production.railway.app/api
VITE_APP_NAME=AI Election Assistant
```

---

## 🧪 Testing Production

### 1. Test Backend Health
```bash
curl https://election-api-production.railway.app/api/health
# Should return: {"status":"Server is running!"}
```

### 2. Test User Registration
```javascript
// In browser console on production site
await window.electionAPI.register(
    "Test User",
    "test@example.com",
    "password123"
);
```

### 3. Test Admin Login
```javascript
// Login with admin account
await window.electionAPI.login("admin@example.com", "YourPassword123");

// Then visit /admin.html
window.location.href = '/admin.html';
```

### 4. Test Voting
```javascript
await window.electionAPI.castVote("BJP");
```

---

## 🔒 Security Best Practices

### For Production
```
✅ Use HTTPS everywhere (automatic on Vercel/Railway)
✅ Enable CORS only for your domain
✅ Use strong JWT_SECRET (min 32 chars, random)
✅ Keep .env files out of git (use .gitignore)
✅ Enable MongoDB password authentication
✅ Use rate limiting (already implemented)
✅ Never commit real credentials
✅ Rotate JWT_SECRET periodically
✅ Monitor admin access logs
✅ Enable MongoDB IP whitelist
```

### Environment Variables to Keep Secret
```
MONGODB_URI      (contains password)
JWT_SECRET       (used to sign tokens)
EMAIL_PASSWORD   (if using email notifications)
API_KEYS         (3rd party services)
```

---

## 🆘 Troubleshooting Deployment

### Backend won't start
```
1. Check environment variables are set
2. Verify MongoDB connection string is correct
3. Check Node version (should be >=14)
4. Check logs: railway logs or render logs
```

### Frontend can't connect to backend
```
1. Verify CORS is enabled
2. Check API_URL in api-client.js
3. Ensure backend is running
4. Check browser console for errors
```

### "Too many requests" errors
```
1. Rate limit triggered (100 req/15 min per IP)
2. Wait 15 minutes or change IP
3. Adjust in rateLimit.js if needed
```

### MongoDB connection fails
```
1. Verify connection string format
2. Check database name is correct
3. Verify credentials are correct
4. Ensure IP is whitelisted
5. Check internet connection
```

---

## 📊 Monitoring in Production

### Check Backend Status
```bash
# Via Railway
railway logs --tail

# Via Render
# Check in dashboard
```

### Monitor Database
```
MongoDB Atlas Dashboard:
- Connection status
- CPU/Memory usage
- Number of operations
- Network access logs
```

### Track Votes in Real-Time
```javascript
// On admin dashboard, checks every 5 seconds
setInterval(loadDashboard, 5000);
```

---

## 🎬 Final Deployment Summary

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | `https://yourdomain.vercel.app` |
| Backend API | Railway/Render | `https://api.yourdomain.railway.app` |
| Database | MongoDB Atlas | `mongodb+srv://...` |
| Admin Panel | Vercel | `https://yourdomain.vercel.app/admin.html` |

---

## ✅ Phase 3 Complete

**Status**: Production-Ready
**Features**: Admin Dashboard + Rate Limiting + Analytics
**Deployment**: Ready for production

**Total Phases Completed**: 3/3
- ✅ Phase 1: Backend Foundation (Node + Express + MongoDB)
- ✅ Phase 2: Authentication (JWT + Registration/Login)
- ✅ Phase 3: Admin Dashboard & Deployment

**Next Steps**:
1. Deploy backend to Railway/Render
2. Deploy frontend to Vercel
3. Create first admin user
4. Test all features in production
5. Monitor usage and votes
