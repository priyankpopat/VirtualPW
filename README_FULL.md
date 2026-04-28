# 🗳️ AI Election Assistant - Full-Stack Application

A **production-ready election management system** with real-time voting, admin analytics, and secure authentication.

## ✨ Features

### 🎯 Core Features
- ✅ **Secure Voting System** - One vote per user with backend validation
- ✅ **Live Results** - Real-time vote updates via WebSocket
- ✅ **User Authentication** - JWT-based login/register with email
- ✅ **Guest Mode** - Vote without creating account (local storage only)
- ✅ **Admin Dashboard** - Complete election analytics and vote auditing
- ✅ **Rate Limiting** - Prevents abuse (100 req/15 min per IP)
- ✅ **Eligibility Checker** - Smart form with personalized guidance
- ✅ **Polling Booth Finder** - Google Maps integration
- ✅ **AI Assistant** - Chatbot with predefined responses

### 🔐 Security
- ✅ **Password Hashing** - Bcryptjs with 10 salt rounds
- ✅ **JWT Tokens** - 7-day expiration
- ✅ **CORS Protection** - Configurable origins
- ✅ **Role-Based Access** - Voter and Admin roles
- ✅ **One Vote Per User** - Database constraints
- ✅ **Audit Logging** - Complete vote history tracking

### 📊 Admin Features
- Real-time statistics dashboard
- Vote distribution charts and analytics
- Complete audit log with pagination
- User management
- Election reset capability
- Admin user creation

---

## 🏗️ Architecture

### Technology Stack

**Frontend**
- HTML5, CSS3, JavaScript ES6+
- Chart.js for visualizations
- Socket.io for real-time updates
- No framework dependencies (pure vanilla JS)

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT authentication
- Socket.io for WebSockets
- Bcryptjs for password hashing

**Database**
- MongoDB (cloud or local)
- User collection (name, email, password, role)
- Vote collection (userId, party, timestamp)

**Deployment**
- Frontend: Vercel
- Backend: Railway or Render
- Database: MongoDB Atlas

### Folder Structure

```
election-assistant/
├── index.html                 # Landing/login page
├── dashboard.html             # Main voting dashboard
├── admin.html                 # Admin dashboard
├── script.js                  # Frontend logic
├── api-client.js              # API communication
├── style.css                  # UI styling
├── backend/
│   ├── server.js              # Express server
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment template
│   ├── create-admin.js        # Admin user initialization
│   ├── Procfile               # Deployment config
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Vote.js            # Vote schema
│   ├── routes/
│   │   ├── auth.js            # Login/Register
│   │   └── admin.js           # Admin endpoints
│   └── middleware/
│       ├── auth.js            # JWT verification
│       └── rateLimit.js       # Rate limiting
├── PHASE_1_BACKEND.md         # Backend setup guide
├── PHASE_2_AUTH.md            # Authentication guide
└── PHASE_3_DEPLOYMENT.md      # Deployment guide
```

---

## 🚀 Quick Start

### Local Development

**1. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB connection string
npm run dev
# Server runs on http://localhost:5000
```

**2. Frontend Setup**
```bash
# Open index.html in browser
# Or use live server
npx http-server
```

**3. Create Admin User**
```bash
# While backend is running
node backend/create-admin.js "Admin Name" "admin@example.com" "password123"
```

### First Use
1. Open `index.html`
2. Choose: Register → Login → Guest
3. Go to dashboard.html after login
4. Cast your vote!
5. If admin, visit admin.html for analytics

---

## 🔑 Three Authentication Modes

### 1️⃣ Register (Email + Password)
- Creates permanent account in MongoDB
- Generates JWT token
- Can login from any device

### 2️⃣ Login (Email + Password)
- Authenticates existing user
- Issues JWT token
- Same as register for existing account

### 3️⃣ Guest Mode (Name Only)
- No account creation
- Uses sessionStorage only
- Vote only lasts in current session
- Perfect for testing/public events

---

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register
  Body: {name, email, password}
  Response: {success, token, user}

POST /api/auth/login
  Body: {email, password}
  Response: {success, token, user}
```

### Voting
```
POST /api/vote
  Headers: {Authorization: Bearer token}
  Body: {party}
  Response: {success, message}

GET /api/votes
  Response: {BJP, Congress, AAP, total}
```

### Admin Routes (require admin JWT)
```
GET /api/admin/stats
  Response: {totalVotes, totalUsers, voteCounts, percentages, leadingParty}

GET /api/admin/votes
  Response: [{userId, party, timestamp}...]

GET /api/admin/audit-log?limit=100&skip=0
  Response: {total, votes: [{voter, email, party, timestamp}...]}

POST /api/admin/reset
  Response: {success, message, deletedCount}
```

---

## 🛠️ Development Guide

### Adding New Features

**Backend Route:**
```javascript
// backend/routes/yourfeature.js
router.get('/endpoint', verifyToken, (req, res) => {
    res.json({ success: true });
});
```

**Frontend Call:**
```javascript
// In api-client.js
async function yourFeatureAPI() {
    const response = await fetch(`${API_URL}/endpoint`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return await response.json();
}
```

**Use in script.js:**
```javascript
window.electionAPI.yourFeature().then(data => {
    console.log(data);
});
```

---

## 🧪 Testing

### Local Testing
```javascript
// Register
await window.electionAPI.register("John", "john@test.com", "password123");

// Login
await window.electionAPI.login("john@test.com", "password123");

// Vote
await window.electionAPI.castVote("BJP");

// Get votes
const votes = await window.electionAPI.getVotes();
console.log(votes);

// Admin stats (if admin)
const stats = await window.electionAPI.getAdminStats();
console.log(stats);
```

### Test Parties
- **BJP** (Bharatiya Janata Party)
- **Congress** (Indian National Congress)
- **AAP** (Aam Aadmi Party)

---

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers supported

---

## 🔐 Security Considerations

### Before Production
```
1. Change JWT_SECRET to random 32+ character string
2. Use HTTPS everywhere (automatic on Vercel/Railway)
3. Enable MongoDB authentication
4. Whitelist specific IPs for MongoDB (if possible)
5. Set CORS to only your domain
6. Store credentials in environment variables
7. Enable audit logging
8. Monitor admin access
9. Regular security audits
10. Keep dependencies updated
```

### Rate Limiting
```
Configured: 100 requests per 15 minutes per IP
Adjust in backend/middleware/rateLimit.js if needed
```

---

## 🌐 Deployment

See [PHASE_3_DEPLOYMENT.md](PHASE_3_DEPLOYMENT.md) for complete deployment guide.

### Quick Deploy

**Backend (Railway)**
```bash
npm install -g @railway/cli
railway init
railway variables set MONGODB_URI "..."
railway variables set JWT_SECRET "..."
railway up
```

**Frontend (Vercel)**
```bash
npm install -g vercel
vercel
```

---

## 🐛 Troubleshooting

### Voting not working
- Check backend is running
- Verify JWT token is valid
- Check MongoDB connection
- Review browser console for errors

### Admin dashboard shows no data
- Verify user has admin role
- Check MongoDB has votes
- Verify database connection string

### CORS errors
- Check API_URL in api-client.js
- Verify CORS is enabled in server.js
- Check backend is running

### Rate limiting errors
- Wait 15 minutes or change IP
- Adjust limits in rateLimit.js if needed

---

## 📚 Documentation

- **[PHASE_1_BACKEND.md](PHASE_1_BACKEND.md)** - Backend setup and API
- **[PHASE_2_AUTH.md](PHASE_2_AUTH.md)** - Authentication system
- **[PHASE_3_DEPLOYMENT.md](PHASE_3_DEPLOYMENT.md)** - Deployment guide

---

## 📄 License

This project is open source and available for educational purposes.

---

## 👤 Support

For issues and questions:
1. Check the documentation files
2. Review error messages in console
3. Check backend logs
4. Verify environment variables

---

## 🎉 Congratulations!

You now have a **production-ready election management system** with:
- ✅ Secure voting with JWT authentication
- ✅ Real-time results and analytics
- ✅ Admin dashboard with complete audit trail
- ✅ Rate limiting and security features
- ✅ Ready for cloud deployment

**Happy voting! 🗳️**
