const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        
        // Find the admin user
        const admin = await User.findOne({ email: '123456akansh@gmail.com' });
        
        if (!admin) {
            console.log('Admin user not found!');
            return;
        }

        // Reset password to admin123
        admin.password = 'admin123';
        await admin.save();
        
        console.log('Admin password reset successfully!');
        console.log('Email: 123456akansh@gmail.com');
        console.log('New Password: admin123');
        
    } catch (error) {
        console.error('Error resetting admin password:', error);
    } finally {
        mongoose.connection.close();
    }
};

resetAdminPassword();
