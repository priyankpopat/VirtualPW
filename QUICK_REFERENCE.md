# 📋 Quick Reference Card

**AI Election Assistant v3.0.0**
Print this page or keep it in another window while working

---

## ⚡ Quick Commands

### Windows Quick Start
```
start-dev.bat
```

### Mac/Linux Quick Start
```
chmod +x start-dev.sh
./start-dev.sh
```

### Manual Backend Start
```
cd backend
npm install
npm run dev
```

### Open Frontend
```
Browser: file:///D:/election-assistant/index.html
Or: http://localhost:8080 (with npx http-server)
```

---

## 🔗 Important URLs

| Purpose | URL |
|---------|-----|
| Landing Page | `index.html` |
| Dashboard | `dashboard.html` |
| Admin | `admin.html` |
| Backend API | `http://localhost:5000/api` |
| Health Check | `http://localhost:5000/api/health` |
| MongoDB Atlas | `mongodb.com/cloud/atlas` |
| Vercel | `vercel.com` |
| Railway | `railway.app` |

---

## 📚 Key Documentation

| Need | File |
|------|------|
| Get Started | `START_HERE.md` |
| Local Setup | `GETTING_STARTED.md` |
| Deployment | `QUICK_DEPLOY.md` |
| Verify Files | `FILE_VERIFICATION.md` |
| GitHub | `GITHUB_GUIDE.md` |
| All Features | `README_FULL.md` |

---

## 🔧 .env Configuration

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/election-assistant
JWT_SECRET=your_random_secret_here_32_chars_minimum
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Get MONGODB_URI from:**
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create M0 cluster
4. Click Connect → Copy connection string
5. Add username/password

---

## 🧪 Testing Commands

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'
```

### Create Admin User
```bash
cd backend
node create-admin.js "Admin Name" "admin@test.com" "password123"
```

### Get Votes
```bash
curl http://localhost:5000/api/votes
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | `npm install` in backend/ |
| Port 5000 in use | Change PORT in .env to 5001 |
| MongoDB won't connect | Check MONGODB_URI in .env |
| .env not found | `cp backend/.env.example backend/.env` |
| Frontend can't reach backend | Check API_URL in api-client.js |
| npm install fails | Delete node_modules, try again |
| Port blocked | Windows: `netstat -ano \| findstr :5000` |

---

## ✅ Testing Checklist

- [ ] Backend starts: `npm run dev`
- [ ] Health check works: `curl http://localhost:5000/api/health`
- [ ] Can register user
- [ ] Can login
- [ ] Can cast vote
- [ ] Results update in real-time
- [ ] Can access admin dashboard
- [ ] Admin can see statistics
- [ ] All pages load without errors
- [ ] No console errors (F12)

---

## 🚀 Deployment Checklist

- [ ] All local tests pass
- [ ] Create Vercel account
- [ ] Create Railway account
- [ ] Create MongoDB Atlas account
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Set environment variables
- [ ] Test production site
- [ ] Create admin user in production

---

## 📁 Key Files

### Frontend
- `index.html` - Landing & login
- `dashboard.html` - Voting page
- `admin.html` - Admin dashboard
- `script.js` - All frontend logic
- `api-client.js` - API calls
- `style.css` - Styling

### Backend
- `backend/server.js` - Main server
- `backend/package.json` - Dependencies
- `backend/.env` - Configuration (create from .env.example)
- `backend/routes/auth.js` - Login/register
- `backend/routes/admin.js` - Admin endpoints
- `backend/models/User.js` - User schema
- `backend/models/Vote.js` - Vote schema

---

## 🎯 Timeline

| Time | Task |
|------|------|
| T+00 | Read START_HERE.md |
| T+05 | Run startup script |
| T+20 | Test all features |
| T+30 | Read QUICK_DEPLOY.md |
| T+35 | Create cloud accounts |
| T+40 | Deploy frontend |
| T+50 | Deploy backend |
| T+60 | Test production |
| T+75 | 🎉 Live! |

---

## 💡 Pro Tips

1. **Keep docs open** while working (side monitor if possible)
2. **Test locally first** before deploying
3. **Save all passwords** and secrets in password manager
4. **Use MongoDB Atlas** (easiest, free tier)
5. **Check browser console** (F12) if frontend errors
6. **Check terminal** if backend errors
7. **Use Postman** for API testing (easier than curl)
8. **Don't commit .env** to GitHub (add to .gitignore)
9. **Test on mobile** after deployment
10. **Create backup** of database settings

---

## 🔐 Security Reminders

✓ Change JWT_SECRET to random value
✓ Use strong MongoDB password
✓ Don't share .env file
✓ Add .env to .gitignore
✓ Use HTTPS (automatic on Vercel/Railway)
✓ Enable rate limiting (default: enabled)
✓ Test admin authentication
✓ Monitor logs for errors
✓ Keep dependencies updated
✓ Regular backups

---

## 📱 Browser Requirements

| Feature | Browser |
|---------|---------|
| Works | Chrome 90+ |
| Works | Firefox 88+ |
| Works | Safari 14+ |
| Works | Edge 90+ |
| Tested | Mobile Chrome |
| Tested | Mobile Safari |

---

## 🆘 Where to Find Help

1. **Setup**: GETTING_STARTED.md
2. **Deployment**: QUICK_DEPLOY.md
3. **Errors**: FILE_VERIFICATION.md
4. **Technical**: README_FULL.md
5. **Git**: GITHUB_GUIDE.md
6. **Backend**: backend/README.md

---

## 🎓 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/health | ✗ | Server status |
| POST | /api/auth/register | ✗ | Create account |
| POST | /api/auth/login | ✗ | Login user |
| GET | /api/votes | ✗ | Get vote counts |
| POST | /api/vote | ✓ | Cast vote |
| GET | /api/admin/stats | ✓ | Dashboard stats |
| GET | /api/admin/votes | ✓ | All votes |
| GET | /api/admin/audit-log | ✓ | Vote history |
| POST | /api/admin/reset | ✓ | Reset election |

---

## 📊 Database

### Users Collection
```
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed",
  role: "voter" | "admin",
  createdAt: timestamp
}
```

### Votes Collection
```
{
  userId: "ObjectId",
  party: "BJP" | "Congress" | "AAP",
  timestamp: timestamp
}
```

---

## 🎯 You Got This! 🚀

**Start:** Read `START_HERE.md`
**Test:** Run `start-dev.bat` or `./start-dev.sh`
**Deploy:** Follow `QUICK_DEPLOY.md`
**Live:** Check your URLs!

---

**Questions?** Check the full documentation or browser console (F12)
**Stuck?** Re-read the relevant guide section
**Ready?** Let's launch! 🗳️

---

*AI Election Assistant v3.0.0*
*Print this card for easy reference*
