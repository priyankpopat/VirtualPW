// ========================================
// ELECTION ASSISTANT - BACKEND SERVER
// ========================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

// Import routes & middleware
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const rateLimitMiddleware = require('./middleware/rateLimit');
const { verifyToken, requireRole } = require('./middleware/auth');
const User = require('./models/User');
const Vote = require('./models/Vote');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(rateLimitMiddleware(15 * 60 * 1000, 100)); // 100 requests per 15 minutes

// ========================================
// MONGODB CONNECTION
// ========================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/election-assistant', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✓ MongoDB Connected');
}).catch(err => {
    console.log('✗ MongoDB Error:', err.message);
});

// ========================================
// AUTHENTICATION ROUTES
// ========================================
app.use('/api/auth', authRoutes);

// ========================================
// ADMIN ROUTES
// ========================================
app.use('/api/admin', adminRoutes);

// ========================================
// API ROUTES
// ========================================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// Get all votes
app.get('/api/votes', async (req, res) => {
    try {
        const votes = await Vote.find();
        const counts = {
            BJP: votes.filter(v => v.party === 'BJP').length,
            Congress: votes.filter(v => v.party === 'Congress').length,
            AAP: votes.filter(v => v.party === 'AAP').length,
            total: votes.length
        };
        res.json(counts);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Cast a vote (REQUIRES JWT)
app.post('/api/vote', verifyToken, async (req, res) => {
    try {
        const { party } = req.body;
        const userId = req.userId; // From JWT token

        if (!['BJP', 'Congress', 'AAP'].includes(party)) {
            return res.status(400).json({ error: 'Invalid party' });
        }

        // Check if user already voted
        const existingVote = await Vote.findOne({ userId });
        if (existingVote) {
            return res.status(400).json({ error: 'User already voted' });
        }

        // Create new vote
        const vote = new Vote({ userId, party });
        await vote.save();

        // Broadcast to all clients
        io.emit('voteUpdate', {
            party: party,
            message: `Vote recorded for ${party}`
        });

        res.json({ success: true, message: 'Vote recorded!' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// ========================================
// WEBSOCKET REAL-TIME UPDATES
// ========================================

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });

    socket.on('requestVoteUpdate', async () => {
        const votes = await Vote.find();
        const counts = {
            BJP: votes.filter(v => v.party === 'BJP').length,
            Congress: votes.filter(v => v.party === 'Congress').length,
            AAP: votes.filter(v => v.party === 'AAP').length,
            total: votes.length
        };
        socket.emit('voteData', counts);
    });
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Backend: http://localhost:${PORT}`);
    console.log(`✓ WebSocket: ws://localhost:${PORT}`);
});
