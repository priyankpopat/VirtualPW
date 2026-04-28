# Election Assistant Backend

## Phase 1: Backend Foundation

### Quick Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env and add:
# - MONGODB_URI: Your MongoDB connection string
# - PORT: 5000 (default)
```

3. **Run Server**
```bash
npm run dev
```

Server will start on `http://localhost:5000`

### API Endpoints

#### Get Vote Counts
```
GET /api/votes
Response: { BJP: 0, Congress: 0, AAP: 0, total: 0 }
```

#### Cast a Vote
```
POST /api/vote
Body: { userId: "user123", party: "BJP" }
Response: { success: true, message: "Vote recorded!" }
```

### Database Schema

**User Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: 'voter' | 'admin',
  createdAt: Date
}
```

**Vote Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  party: 'BJP' | 'Congress' | 'AAP',
  timestamp: Date
}
```

### Real-Time Updates (WebSocket)

The server broadcasts vote updates in real-time using Socket.io:

```javascript
io.emit('voteUpdate', { party: 'BJP', message: 'Vote recorded for BJP' });
```

### MongoDB Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free tier cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/election-assistant`
4. Add to `.env` as `MONGODB_URI`

### Next Steps (Phase 2)

- [ ] Add JWT authentication
- [ ] Add user registration/login
- [ ] Add role-based access control
- [ ] Add admin dashboard APIs

---

**Status**: ✅ Phase 1 Complete
**Next Phase**: Authentication (Phase 2)
