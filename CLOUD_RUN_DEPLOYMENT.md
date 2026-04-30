# 🚀 Deploy to Google Cloud Run

**Complete Guide: Frontend + Backend Deployment**
**Time: 45-60 minutes**

---

## 📋 Prerequisites

1. **Google Cloud Account** - https://console.cloud.google.com/
2. **Google Cloud CLI** - https://cloud.google.com/sdk/docs/install
3. **Docker** - https://www.docker.com/products/docker-desktop/
4. **Project code** (already in GitHub)

---

## ⚡ Step 1: Install Google Cloud SDK

### Windows:
```bash
# Download installer from:
# https://cloud.google.com/sdk/docs/install-sdk#windows

# Or use:
choco install google-cloud-sdk

# Then verify:
gcloud --version
```

### Mac:
```bash
brew install --cask google-cloud-sdk
gcloud --version
```

### Linux:
```bash
curl https://sdk.cloud.google.com | bash
gcloud --version
```

---

## 🔑 Step 2: Authenticate with Google Cloud

```bash
# Login to your Google account
gcloud auth login

# Create new project
gcloud projects create election-assistant --name="Election Assistant"

# Set as active project
gcloud config set project election-assistant

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

---

## 🐳 Step 3: Create Dockerfiles

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
# Use Node.js runtime
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start server
CMD ["node", "server.js"]
```

### Frontend Dockerfile (Optional - Can use Cloud Storage instead)

Create `Dockerfile` in root:

```dockerfile
# Serve static files
FROM nginx:alpine

# Copy frontend files to nginx
COPY index.html /usr/share/nginx/html/
COPY dashboard.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY api-client.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/

# Configure nginx
RUN echo 'server { listen 8080; root /usr/share/nginx/html; try_files $uri $uri/ /index.html; }' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
```

---

## 🚀 Step 4: Deploy Backend to Cloud Run

### Option A: Deploy from Local (Docker installed)

```bash
# Navigate to backend
cd backend

# Build Docker image
docker build -t election-assistant-backend .

# Tag for Google Container Registry
docker tag election-assistant-backend gcr.io/election-assistant/backend:latest

# Push to Google Container Registry
docker push gcr.io/election-assistant/backend:latest

# Deploy to Cloud Run
gcloud run deploy election-assistant-backend \
  --image gcr.io/election-assistant/backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_URI=your_mongodb_uri,JWT_SECRET=your_jwt_secret,NODE_ENV=production"
```

### Option B: Deploy from GitHub (Automatic)

```bash
# Connect GitHub repository
gcloud run deploy election-assistant-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_URI=your_mongodb_uri,JWT_SECRET=your_jwt_secret"
```

**Output will show your backend URL:**
```
Service [election-assistant-backend] revision [1] has been deployed
Service URL: https://election-assistant-backend-xxxxx.a.run.app
```

---

## 📁 Step 5: Deploy Frontend to Cloud Storage

### Easy Option: Cloud Storage + Cloud CDN

```bash
# Create storage bucket
gsutil mb gs://election-assistant-frontend/

# Upload frontend files
gsutil -m cp index.html gs://election-assistant-frontend/
gsutil -m cp dashboard.html gs://election-assistant-frontend/
gsutil -m cp admin.html gs://election-assistant-frontend/
gsutil -m cp script.js gs://election-assistant-frontend/
gsutil -m cp api-client.js gs://election-assistant-frontend/
gsutil -m cp style.css gs://election-assistant-frontend/

# Make files public
gsutil -m acl ch -u AllUsers:R gs://election-assistant-frontend/*

# Enable website
gsutil web set -m index.html -e index.html gs://election-assistant-frontend/

# Get public URL
echo "Frontend URL: https://storage.googleapis.com/election-assistant-frontend/index.html"
```

### Better Option: Cloud Run (Nginx)

```bash
# From project root
docker build -t election-assistant-frontend .

docker tag election-assistant-frontend gcr.io/election-assistant/frontend:latest

docker push gcr.io/election-assistant/frontend:latest

gcloud run deploy election-assistant-frontend \
  --image gcr.io/election-assistant/frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

---

## 🔗 Step 6: Update API URLs

After getting backend URL, update `api-client.js`:

```javascript
// Change this:
const API_URL = 'http://localhost:5000/api';

// To this (your Cloud Run backend URL):
const API_URL = 'https://election-assistant-backend-xxxxx.a.run.app/api';
```

Then redeploy frontend:
```bash
# Update and redeploy frontend to Cloud Run
gcloud run deploy election-assistant-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🗄️ Step 7: Connect MongoDB Atlas Database

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Create cluster (M0 free tier)
3. Get connection string
4. Set environment variable in Cloud Run:

```bash
gcloud run services update election-assistant-backend \
  --set-env-vars "MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/election-assistant"
```

---

## 📊 Step 8: Environment Variables

Set all required environment variables on Cloud Run:

```bash
gcloud run services update election-assistant-backend \
  --update-env-vars \
    MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/election-assistant" \
    JWT_SECRET="your_random_secret_here_32_chars_minimum" \
    NODE_ENV="production" \
    FRONTEND_URL="https://election-assistant-frontend-xxxxx.a.run.app"
```

---

## 🧪 Step 9: Test Deployment

1. **Open frontend URL** in browser
2. **Register new user**
3. **Login**
4. **Cast vote**
5. **Check admin dashboard**

If issues occur:
```bash
# View backend logs
gcloud run logs read election-assistant-backend --limit 50

# View frontend logs
gcloud run logs read election-assistant-frontend --limit 50
```

---

## 🔒 Step 10: Enable HTTPS & Security

Google Cloud Run automatically provides HTTPS ✅

**Additional Security:**
```bash
# Add rate limiting
gcloud run services update election-assistant-backend \
  --cpu-boost

# Add authentication if needed
gcloud run services update election-assistant-backend \
  --no-allow-unauthenticated
```

---

## 📈 Step 11: Monitor & Logs

### View Logs:
```bash
# Real-time logs
gcloud run logs read election-assistant-backend --follow

# Last 100 lines
gcloud run logs read election-assistant-backend --limit 100

# Frontend logs
gcloud run logs read election-assistant-frontend --limit 50
```

### View Metrics:
1. Go to: https://console.cloud.google.com/run
2. Click your service
3. View: Metrics, Logs, Revisions

---

## 💰 Pricing & Costs

**Google Cloud Run Free Tier (per month):**
- 2 million requests
- 360,000 GB-seconds
- 180,000 vCPU-seconds

**Monthly Cost: $0** (if within free tier)

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared cluster
- Monthly Cost: $0**

**Total Monthly Cost: $0** ✅

---

## 🎯 Quick Commands Reference

```bash
# View all services
gcloud run services list

# Get service details
gcloud run services describe election-assistant-backend

# Update service
gcloud run services update election-assistant-backend --set-env-vars KEY=VALUE

# Delete service
gcloud run services delete election-assistant-backend

# Stream logs
gcloud run logs read election-assistant-backend --follow

# Set region default
gcloud config set run/region us-central1
```

---

## ✅ Deployment Checklist

- [ ] Google Cloud SDK installed
- [ ] Google Cloud project created
- [ ] APIs enabled (Cloud Run, Cloud Build, Container Registry)
- [ ] Dockerfiles created (backend & frontend)
- [ ] Backend deployed to Cloud Run
- [ ] Frontend deployed to Cloud Run/Storage
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables set
- [ ] API URL updated in frontend
- [ ] Frontend redeployed
- [ ] All URLs tested
- [ ] Login/voting works in production
- [ ] Admin dashboard works
- [ ] Logs showing no errors

---

## 🆘 Troubleshooting

### "Docker not found"
```bash
# Install Docker Desktop
# https://www.docker.com/products/docker-desktop/
```

### "gcloud not found"
```bash
# Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install
```

### "Authentication failed"
```bash
# Re-authenticate
gcloud auth login
```

### "Backend not responding"
```bash
# Check if running
gcloud run services describe election-assistant-backend

# View logs
gcloud run logs read election-assistant-backend --limit 50

# Restart
gcloud run services update election-assistant-backend --force
```

### "MongoDB connection failed"
```bash
# Verify connection string
# Check IP whitelist in MongoDB Atlas
# Add your Cloud Run IP to whitelist:
# https://cloud.mongodb.com/v2/[projectId]#clusters/security/0
```

---

## 📱 Final URLs

After deployment, you'll have:

```
Frontend: https://election-assistant-frontend-xxxxx.a.run.app
Backend:  https://election-assistant-backend-xxxxx.a.run.app
Database: MongoDB Atlas (cloud)
```

---

## 🎉 Success!

Your election assistant is now **live on Google Cloud Run!**

**Share your URLs:**
- Frontend: [Your frontend URL]
- Backend: [Your backend URL]

---

**Next Steps:**
1. Test all features in production
2. Share with users
3. Monitor logs and metrics
4. Make updates and redeploy

**Estimated Time: 45-60 minutes**
**Cost: FREE (within free tier)**

---

*Google Cloud Run Deployment Guide - Election Assistant v3.0.0*
