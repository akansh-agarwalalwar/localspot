const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Invalid or inactive user' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            logActivity(req.user._id, 'READ', 'UNAUTHORIZED_ACCESS', null, 
                `Attempted to access ${req.originalUrl}`, req.ip, req.get('User-Agent'), 'FAILED');
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        next();
    };
};

const authorizePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user.permissions[permission]) {
            logActivity(req.user._id, 'READ', 'UNAUTHORIZED_ACCESS', null, 
                `Missing ${permission} permission for ${req.originalUrl}`, req.ip, req.get('User-Agent'), 'FAILED');
            return res.status(403).json({ message: `Missing ${permission} permission` });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole,
    authorizePermission
};
