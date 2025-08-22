const mongoose = require('mongoose');
const { logActivity } = require('../utils/activityLogger');
const User = require('../models/User');
require('dotenv').config();

const seedActivities = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        
        // Find admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            console.log('Admin user not found. Please create an admin user first.');
            return;
        }

        console.log('Creating sample activities...');

        // Sample activities
        const activities = [
            {
                userId: adminUser._id,
                action: 'CREATE',
                resource: 'SUBADMIN',
                details: `${adminUser.username} created a new subadmin account`,
                status: 'SUCCESS'
            },
            {
                userId: adminUser._id,
                action: 'CREATE',
                resource: 'PROPERTY',
                details: `${adminUser.username} listed a new PG property in Delhi`,
                status: 'SUCCESS'
            },
            {
                userId: adminUser._id,
                action: 'DELETE',
                resource: 'SUBADMIN',
                details: `${adminUser.username} removed a subadmin from the system`,
                status: 'SUCCESS'
            }
        ];

        for (const activity of activities) {
            await logActivity(
                activity.userId,
                activity.action,
                activity.resource,
                null,
                activity.details,
                '127.0.0.1',
                'Sample Data Script',
                activity.status
            );
        }

        console.log('Sample activities created successfully');
        
    } catch (error) {
        console.error('Error creating sample activities:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedActivities();
