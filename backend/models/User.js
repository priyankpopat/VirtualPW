// ========================================
// USER MODEL
// ========================================

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: String,
    role: { type: String, enum: ['voter', 'admin'], default: 'voter' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
