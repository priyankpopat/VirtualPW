// ========================================
// ADMIN ROUTES
// ========================================

const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

// Protect all admin routes
router.use(verifyToken);
router.use(requireRole('admin'));

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const totalVotes = await Vote.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        
        const votes = await Vote.find().select('party').lean();
        const voteCounts = {
            BJP: votes.filter(v => v.party === 'BJP').length,
            Congress: votes.filter(v => v.party === 'Congress').length,
            AAP: votes.filter(v => v.party === 'AAP').length
        };
        
        // Calculate percentages
        const total = voteCounts.BJP + voteCounts.Congress + voteCounts.AAP;
        const percentages = {
            BJP: total > 0 ? Math.round((voteCounts.BJP / total) * 100) : 0,
            Congress: total > 0 ? Math.round((voteCounts.Congress / total) * 100) : 0,
            AAP: total > 0 ? Math.round((voteCounts.AAP / total) * 100) : 0
        };
        
        // Find leading party
        const leadingParty = Object.keys(voteCounts).reduce((a, b) => 
            voteCounts[a] > voteCounts[b] ? a : b
        );
        
        res.json({
            totalVotes,
            totalUsers,
            totalAdmins,
            voteCounts,
            percentages,
            leadingParty,
            electionStatus: totalVotes > 0 ? 'Active' : 'Inactive'
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Votes with Details
router.get('/votes', async (req, res) => {
    try {
        const votes = await Vote.find()
            .populate('userId', 'name email')
            .sort('-timestamp')
            .lean();
        
        res.json(votes);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Vote Timeline (for charts)
router.get('/votes/timeline', async (req, res) => {
    try {
        const votes = await Vote.find().select('timestamp party').lean();
        
        // Group by hour
        const timeline = {};
        votes.forEach(vote => {
            const hour = new Date(vote.timestamp).toISOString().slice(0, 13);
            if (!timeline[hour]) {
                timeline[hour] = { BJP: 0, Congress: 0, AAP: 0 };
            }
            timeline[hour][vote.party]++;
        });
        
        res.json(timeline);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort('-createdAt')
            .lean();
        
        res.json(users);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Election (Admin Only)
router.post('/reset', async (req, res) => {
    try {
        const result = await Vote.deleteMany({});
        
        res.json({
            success: true,
            message: `Election reset. ${result.deletedCount} votes deleted.`
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Admin User (requires existing admin)
router.post('/create-admin', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const bcrypt = require('bcryptjs');
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });
        
        await adminUser.save();
        
        res.json({
            success: true,
            message: 'Admin user created',
            user: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Audit Log - Get vote history
router.get('/audit-log', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const skip = parseInt(req.query.skip) || 0;
        
        const votes = await Vote.find()
            .populate('userId', 'name email')
            .sort('-timestamp')
            .limit(limit)
            .skip(skip)
            .lean();
        
        const total = await Vote.countDocuments();
        
        res.json({
            total,
            limit,
            skip,
            votes: votes.map(v => ({
                id: v._id,
                voter: v.userId.name,
                email: v.userId.email,
                party: v.party,
                timestamp: v.timestamp,
                time: new Date(v.timestamp).toLocaleString()
            }))
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
