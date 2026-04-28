// ========================================
// VOTE MODEL
// ========================================

const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    party: { type: String, enum: ['BJP', 'Congress', 'AAP'], required: true },
    timestamp: { type: Date, default: Date.now }
});

// One vote per user
voteSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
