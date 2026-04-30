# ⚡ Google Cloud Run - Quick Start (30 minutes)

**Deploy Election Assistant in 30 minutes**

---

## 🎯 What You'll Get

✅ Backend API running on: `https://[your-service]-backend-[hash].a.run.app`
✅ Frontend running on: `https://[your-service]-frontend-[hash].a.run.app`  
✅ Database: MongoDB Atlas (FREE)
✅ HTTPS automatically enabled
✅ Auto-scaling (handles 1000+ concurrent users)
✅ Logs and monitoring included
✅ **Cost: $0/month** (within free tier)

---

## 🚀 5-Step Deployment

### Step 1: Install Prerequisites (5 min)

**Windows:**
```bash
# Install Google Cloud SDK
choco install google-cloud-sdk

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop/

# Verify installation
gcloud --version
docker --version
```

**Mac:**
```bash
brew install --cask google-cloud-sdk
brew install --cask docker
gcloud --version
docker --version
```

### Step 2: Setup Google Cloud (5 min)

```bash
# Authenticate
gcloud auth login

# Set default project (if not already set)
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Deploy Backend (8 min)

```bash
# Navigate to project root
cd d:\election-assistant

# Build and push backend image
cd backend

docker build -t gcr.io/YOUR_PROJECT_ID/election-backend:latest .

docker push gcr.io/YOUR_PROJECT_ID/election-backend:latest

# Deploy to Cloud Run
gcloud run deploy election-backend \
  --image gcr.io/YOUR_PROJECT_ID/election-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --set-env-vars MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/election-assistant",JWT_SECRET="your_secret_here",NODE_ENV="production"

# Copy the backend URL (shown in output)
# Example: https://election-backend-abc123.a.run.app
```

### Step 4: Deploy Frontend (8 min)

```bash
# Go back to root
cd ..

# Update API_URL in api-client.js with your backend URL
# Replace: https://election-backend-abc123.a.run.app

# Build and push frontend image
docker build -t gcr.io/YOUR_PROJECT_ID/election-frontend:latest .

docker push gcr.io/YOUR_PROJECT_ID/election-frontend:latest

# Deploy to Cloud Run
gcloud run deploy election-frontend \
  --image gcr.io/YOUR_PROJECT_ID/election-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 256Mi \
  --port 8080

# Copy the frontend URL (shown in output)
# Example: https://election-frontend-def456.a.run.app
```

### Step 5: Test & Verify (4 min)

1. Open frontend URL in browser
2. Register new account
3. Login
4. Cast a vote
5. Check admin dashboard

---

## 🔧 Quick Reference

### Get Your URLs

```bash
# Get all deployed services
gcloud run services list

# Get specific service details
gcloud run services describe election-backend --region us-central1
gcloud run services describe election-frontend --region us-central1
```

### View Logs

```bash
# Backend logs (real-time)
gcloud run logs read election-backend --follow

# Frontend logs
gcloud run logs read election-frontend --follow

# Last 50 lines
gcloud run logs read election-backend --limit 50
```

### Update Environment Variables

```bash
gcloud run services update election-backend \
  --region us-central1 \
  --set-env-vars MONGODB_URI="new_uri",JWT_SECRET="new_secret"
```

### Redeploy (after code changes)

```bash
# Update code, then:

# Backend
cd backend
docker build -t gcr.io/YOUR_PROJECT_ID/election-backend:latest .
docker push gcr.io/YOUR_PROJECT_ID/election-backend:latest
gcloud run deploy election-backend --image gcr.io/YOUR_PROJECT_ID/election-backend:latest --region us-central1

# Frontend
cd ..
docker build -t gcr.io/YOUR_PROJECT_ID/election-frontend:latest .
docker push gcr.io/YOUR_PROJECT_ID/election-frontend:latest
gcloud run deploy election-frontend --image gcr.io/YOUR_PROJECT_ID/election-frontend:latest --region us-central1
```

---

## 📋 Checklist

- [ ] Google Cloud SDK installed
- [ ] Docker installed
- [ ] Google Cloud authenticated (`gcloud auth login`)
- [ ] APIs enabled
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Backend URL updated in api-client.js
- [ ] Frontend redeployed
- [ ] MongoDB Atlas connected
- [ ] All URLs tested
- [ ] Voting works
- [ ] Admin dashboard works

---

## 🆘 Troubleshooting

### "gcloud command not found"
```bash
# Install Google Cloud SDK
# Windows: choco install google-cloud-sdk
# Mac: brew install google-cloud-sdk
# Linux: curl https://sdk.cloud.google.com | bash
```

### "Docker not found"
```bash
# Install Docker Desktop
# https://www.docker.com/products/docker-desktop/
```

### "Permission denied when pushing to Registry"
```bash
# Configure Docker authentication
gcloud auth configure-docker
```

### "Backend not responding"
```bash
# Check logs
gcloud run logs read election-backend --limit 20

# Verify MongoDB connection string is correct
# Check that MongoDB whitelist allows Cloud Run IPs
```

### "Frontend shows blank page"
```bash
# Verify api-client.js has correct backend URL
# Check browser console (F12) for errors
# View frontend logs: gcloud run logs read election-frontend
```

---

## 📊 Cost Breakdown

**Google Cloud Run (Free Tier):**
- 2,000,000 requests/month ✓
- 360,000 GB-seconds/month ✓
- 180,000 vCPU-seconds/month ✓
- **Cost: $0**

**MongoDB Atlas (Free Tier):**
- 512 MB storage ✓
- Shared cluster ✓
- **Cost: $0**

**Total Monthly Cost: $0** ✅

---

## 🎉 Success!

Your election assistant is now **live on Google Cloud Run!**

### Your URLs:
```
Frontend: https://election-frontend-[hash].a.run.app
Backend:  https://election-backend-[hash].a.run.app
```

### Next Steps:
1. Share URLs with users
2. Monitor logs regularly
3. Update code and redeploy as needed
4. Scale as needed (Cloud Run handles auto-scaling)

---

## 📞 Help

- **Full guide**: See `CLOUD_RUN_DEPLOYMENT.md`
- **More details**: Run `gcloud run deploy --help`
- **Cloud Console**: https://console.cloud.google.com/run

---

**Total Time: 30 minutes**
**Cost: FREE**
**Complexity: Easy**

🚀 **Happy deploying!**
