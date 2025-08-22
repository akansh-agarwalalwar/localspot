const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const fixAdminPermissions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        
        // Find all admin users
        const adminUsers = await User.find({ role: 'admin' });
        
        if (adminUsers.length === 0) {
            console.log('No admin users found');
            process.exit(0);
        }

        // Update permissions for all admin users
        for (const admin of adminUsers) {
            admin.permissions = {
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: true
            };
            await admin.save();
            console.log(`Updated permissions for admin: ${admin.username}`);
        }
        
        console.log('Admin permissions fixed successfully');
        
    } catch (error) {
        console.error('Error fixing admin permissions:', error);
    } finally {
        mongoose.connection.close();
    }
};

fixAdminPermissions();
