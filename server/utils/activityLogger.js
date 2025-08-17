const Activity = require('../models/Activity');

const logActivity = async (userId, action, resource, resourceId = null, details = '', ipAddress = '', userAgent = '', status = 'SUCCESS') => {
    try {
        const activity = new Activity({
            userId,
            action,
            resource,
            resourceId,
            details,
            ipAddress,
            userAgent,
            status
        });
        await activity.save();
    } catch (error) {
        console.error('Error logging activity:', error);
    }
};

module.exports = { logActivity };
