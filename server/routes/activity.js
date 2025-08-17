const express = require('express');
const Activity = require('../models/Activity');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { logActivity } = require('../utils/activityLogger');

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole('admin'));

const getAllActivities = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const { action, resource, userId, startDate, endDate } = req.query;

        const filter = {};
        if (action) filter.action = action;
        if (resource) filter.resource = resource;
        if (userId) filter.userId = userId;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const activities = await Activity.find(filter)
            .populate('userId', 'username email role')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Activity.countDocuments(filter);

        await logActivity(req.user._id, 'READ', 'ACTIVITY', null, 
            `Retrieved activities list (page ${page})`, req.ip, req.get('User-Agent'));

        res.json({
            activities,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserActivities = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const activities = await Activity.find({ userId })
            .populate('userId', 'username email role')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Activity.countDocuments({ userId });

        await logActivity(req.user._id, 'READ', 'USER_ACTIVITY', userId, 
            `Retrieved user activities for user ${userId}`, req.ip, req.get('User-Agent'));

        res.json({
            activities,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get user activities error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

router.get('/', getAllActivities);
router.get('/user/:userId', getUserActivities);

module.exports = router;
