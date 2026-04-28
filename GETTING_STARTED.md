# 🚀 Getting Started - Local Development Guide

**Last Updated**: April 28, 2026
**Status**: Ready to Run
**Time to Setup**: 10-15 minutes

---

## 📋 Prerequisites

Before you start, make sure you have:

### Required
- **Node.js 14+** - Download from https://nodejs.org/
- **Git** - Download from https://git-scm.com/
- **Internet Connection** - For MongoDB Atlas (or local MongoDB)

### Optional (but helpful)
- **MongoDB Community** - For local database testing (https://www.mongodb.com/try/download/community)
- **Postman** - For API testing (https://www.postman.com/downloads/)
- **VS Code** - For development (https://code.visualstudio.com/)

---

## ⚡ Quick Start (2 options)

### Option 1: Automatic (Windows)
```bash
# 1. Open Command Prompt in election-assistant directory
# 2. Run:
start-dev.bat

# That's it! Backend starts automatically
```

### Option 2: Automatic (Mac/Linux)
```bash
# 1. Open Terminal in election-assistant directory
# 2. Run:
chmod +x start-dev.sh
./start-dev.sh

# That's it! Backend starts automatically
```

### Option 3: Manual
```bash
# 1. Open Terminal/Command Prompt in election-assistant directory
# 2. Navigate to backend:
cd backend

# 3. Install dependencies:
npm install

# 4. Copy environment file:
cp .env.example .env

# 5. Edit .env with your MongoDB URL (see below)

# 6. Start server:
npm run dev

# Server runs on http://localhost:5000
```

---

## 🔧 Configuration

### Step 1: Update MongoDB Connection

**Option A: Use MongoDB Atlas (Cloud - Recommended)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create M0 cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Edit `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/election-assistant
   ```

**Option B: Use Local MongoDB**

1. Install MongoDB Community Edition
2. Start MongoDB (run `mongod` in terminal)
3. Edit `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/election-assistant
   ```

### Step 2: Set JWT Secret

Edit `backend/.env` and add a random JWT secret:
```
JWT_SECRET=your_random_secret_key_here_at_least_32_characters_long
```

**Generate a secure secret** (in Node.js):
```javascript
require('crypto').randomBytes(32).toString('hex')
```

### Step 3: Optional Settings

```env
PORT=5000                    # Change if port 5000 is busy
NODE_ENV=development         # Keep as 'development' for local
FRONTEND_URL=http://localhost:3000  # For CORS testing
```

---

## 🎯 First Run Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (local or Atlas account ready)
- [ ] `backend/.env` file created
- [ ] `MONGODB_URI` set correctly
- [ ] `JWT_SECRET` set to random string
- [ ] `npm install` completed in backend
- [ ] No errors when running `npm run dev`

---

## 🗳️ Testing the System

### 1. Test Backend Health

```bash
# In new terminal/tab, run:
curl http://localhost:5000/api/health

# Should return:
{"status":"Server is running!"}
```

### 2. Create Admin User

```bash
# In backend directory:
node create-admin.js "Admin User" "admin@test.com" "admin123456"

# Output:
# ✓ Admin user created successfully!
#   Email: admin@test.com
#   Password: admin123456
```

### 3. Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Should return JWT token and user info
```

### 4. Test User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Should return JWT token
```

### 5. Test Voting

```bash
# First get token from login
TOKEN="your_jwt_token_here"

# Cast vote
curl -X POST http://localhost:5000/api/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"party": "BJP"}'

# Should return success message
```

### 6. Get Vote Counts

```bash
curl http://localhost:5000/api/votes

# Should return vote counts
```

### 7. Admin Dashboard (requires admin token)

```bash
TOKEN="admin_jwt_token"

curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer $TOKEN"

# Should return dashboard statistics
```

---

## 🌐 Frontend Testing

### 1. Open in Browser

```
file:///D:/election-assistant/index.html
```

Or use live server:
```bash
# In election-assistant directory (new terminal):
npx http-server

# Open: http://localhost:8080
```

### 2. Test Auth Modes

- **Register Tab**: Create new account
- **Login Tab**: Login with created account
- **Guest Tab**: Continue as guest

### 3. Test Voting

1. Login with any mode
2. Go to dashboard
3. Click vote button on any party
4. See vote recorded
5. Check results update

### 4. Test Admin Dashboard

1. Login with admin account
2. Click "Admin Panel" in sidebar (if admin)
3. See stats, charts, audit log
4. Try reset election (WARNING: deletes all votes)

---

## 📁 Project Layout

```
election-assistant/
│
├── 📄 index.html                 # Landing/login page
├── 📄 dashboard.html             # Voting dashboard  
├── 📄 admin.html                 # Admin dashboard
├── 📄 script.js                  # Frontend logic
├── 📄 api-client.js              # API communication
├── 📄 style.css                  # UI styling
│
├── 📂 backend/
│   ├── 📄 server.js              # Express server
│   ├── 📄 package.json           # Dependencies
│   ├── 📄 .env.example           # Config template
│   ├── 📄 .env                   # Your config (create this)
│   ├── 📄 create-admin.js        # Admin setup
│   ├── 📄 Procfile               # Deployment config
│   │
│   ├── 📂 models/
│   │   ├── 📄 User.js            # User schema
│   │   └── 📄 Vote.js            # Vote schema
│   │
│   ├── 📂 routes/
│   │   ├── 📄 auth.js            # Register/login
│   │   └── 📄 admin.js           # Admin endpoints
│   │
│   └── 📂 middleware/
│       ├── 📄 auth.js            # JWT verification
│       └── 📄 rateLimit.js       # Rate limiting
│
├── 📄 start-dev.bat              # Windows startup script
├── 📄 start-dev.sh               # Mac/Linux startup script
│
└── 📚 Documentation/
    ├── README.md
    ├── README_FULL.md
    ├── QUICK_DEPLOY.md
    ├── PHASE_3_DEPLOYMENT.md
    └── GETTING_STARTED.md        # You are here!
```

---

## 🔧 Common Issues & Solutions

### Issue: "Cannot find module 'express'"
**Solution**: Run `npm install` in backend directory

### Issue: "MongoDB connection failed"
**Solution**: 
- Check MONGODB_URI in .env
- Verify MongoDB is running
- Check connection string format
- Verify IP whitelist (for Atlas)

### Issue: "Port 5000 already in use"
**Solution**: 
- Change PORT in .env to 5001, 5002, etc.
- Or kill process using port 5000
- Windows: `netstat -ano | findstr :5000`
- Mac/Linux: `lsof -i :5000`

### Issue: "JWT_SECRET not set"
**Solution**: Add random secret to .env
```
JWT_SECRET=your_random_secret_here
```

### Issue: "Cannot find .env file"
**Solution**: 
- Copy: `cp backend/.env.example backend/.env`
- Or create manually with required variables

### Issue: "Admin login fails"
**Solution**: 
- Create admin user: `node create-admin.js`
- Check user exists in MongoDB
- Verify password matches

### Issue: Frontend can't reach backend
**Solution**:
- Verify API_URL in api-client.js
- Backend running on http://localhost:5000?
- Check browser console for CORS errors
- Try health check: `curl http://localhost:5000/api/health`

---

## 🧪 Testing Tools

### Using Postman (Recommended)

1. Download Postman from https://www.postman.com/
2. Create new collection "Election Assistant"
3. Add requests:
   ```
   GET  http://localhost:5000/api/health
   POST http://localhost:5000/api/auth/register
   POST http://localhost:5000/api/auth/login
   POST http://localhost:5000/api/vote
   GET  http://localhost:5000/api/votes
   ```

### Using cURL (Command Line)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Vote (requires token)
curl -X POST http://localhost:5000/api/vote \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"party":"BJP"}'
```

### Using Browser Console

```javascript
// In browser console (F12):

// Register
await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    name: 'Jane',
    email: 'jane@test.com',
    password: 'password123'
  })
}).then(r => r.json()).then(d => console.log(d));

// Vote
await window.electionAPI.castVote('BJP');

// Get votes
await window.electionAPI.getVotes();
```

---

## 📊 Database Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password_here",
  role: "voter", // or "admin"
  createdAt: 2024-01-01T00:00:00.000Z
}
```

### Votes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId("..."),      // Reference to User
  party: "BJP",                 // or "Congress", "AAP"
  timestamp: 2024-01-01T00:00:00.000Z
}
```

---

## 🚀 Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Open Frontend (new terminal)
```bash
# Option A: Using npx http-server
npx http-server

# Option B: Open directly
file:///D:/election-assistant/index.html

# Option C: Use VS Code Live Server extension
```

### 3. Test Features
- Register user
- Cast vote
- Check results
- Admin login
- View dashboard

### 4. Make Changes
- Edit files
- Backend restarts automatically (nodemon)
- Frontend: Hard refresh (Ctrl+F5) to see changes

### 5. Debug
- Backend: Check terminal output
- Frontend: Open browser DevTools (F12)
- Database: Check MongoDB Atlas dashboard

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `GETTING_STARTED.md` | This guide |
| `README.md` | Project overview |
| `README_FULL.md` | Complete system guide |
| `QUICK_DEPLOY.md` | Deployment guide |
| `PROJECT_SUMMARY.md` | Technical details |

---

## ✅ Next Steps

1. **Follow this guide** to set up locally
2. **Test all features** (register, vote, admin)
3. **Review code** in backend/routes/ and script.js
4. **Make modifications** as needed
5. **Deploy** using QUICK_DEPLOY.md

---

## 🆘 Need Help?

1. Check this guide first
2. Check README_FULL.md
3. Review browser console (F12)
4. Check backend terminal output
5. Check MongoDB Atlas dashboard

---

## 🎉 Ready!

Your development environment is now ready. Start with:

**Windows:**
```bash
start-dev.bat
```

**Mac/Linux:**
```bash
./start-dev.sh
```

**Manual:**
```bash
cd backend && npm install && npm run dev
```

Then open `index.html` in your browser and start voting! 🗳️

---

**Happy Development!** 🚀
