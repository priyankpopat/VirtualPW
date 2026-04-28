// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch(err) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

function requireRole(role) {
    return (req, res, next) => {
        if (req.userRole !== role && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}

module.exports = {
    verifyToken,
    requireRole
};
