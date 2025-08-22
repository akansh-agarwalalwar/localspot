const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'SIGNUP', 'BOOKING']
    },
    resource: {
        type: String,
        required: true
    },
    resourceId: {
        type: String,
        default: null
    },
    details: {
        type: String,
        default: ''
    },
    ipAddress: {
        type: String,
        default: ''
    },
    userAgent: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILED'],
        default: 'SUCCESS'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
