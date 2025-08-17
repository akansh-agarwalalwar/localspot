const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and subadmin role
router.use(authenticateToken);
router.use(authorizeRole('subadmin'));

// Subadmin dashboard route
router.get('/dashboard', (req, res) => {
    res.json({
        message: 'Welcome to subadmin dashboard',
        user: {
            id: req.user._id,
            username: req.user.username,
            role: req.user.role,
            permissions: req.user.permissions
        }
    });
});

module.exports = router;
