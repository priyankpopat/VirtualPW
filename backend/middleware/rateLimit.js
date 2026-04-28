// ========================================
// RATE LIMITING MIDDLEWARE
// ========================================

const rateLimit = new Map();

function rateLimitMiddleware(windowMs = 15 * 60 * 1000, maxRequests = 100) {
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const key = `${ip}-${req.path}`;
        const now = Date.now();
        
        if (!rateLimit.has(key)) {
            rateLimit.set(key, []);
        }
        
        const requests = rateLimit.get(key);
        const recentRequests = requests.filter(time => now - time < windowMs);
        
        if (recentRequests.length >= maxRequests) {
            return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }
        
        recentRequests.push(now);
        rateLimit.set(key, recentRequests);
        next();
    };
}

// Cleanup old entries every hour
setInterval(() => {
    const now = Date.now();
    rateLimit.forEach((requests, key) => {
        const recent = requests.filter(time => now - time < 60 * 60 * 1000);
        if (recent.length === 0) {
            rateLimit.delete(key);
        } else {
            rateLimit.set(key, recent);
        }
    });
}, 60 * 60 * 1000);

module.exports = rateLimitMiddleware;
