const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        
        const admins = await User.find({ role: 'admin' });
        
        console.log('Found admin users:');
        admins.forEach(admin => {
            console.log(`- ID: ${admin._id}`);
            console.log(`  Username: ${admin.username}`);
            console.log(`  Email: ${admin.email}`);
            console.log(`  Role: ${admin.role}`);
            console.log(`  Active: ${admin.isActive}`);
            console.log(`  Created: ${admin.createdAt}`);
            console.log('---');
        });
        
        if (admins.length === 0) {
            console.log('No admin users found!');
        }
        
    } catch (error) {
        console.error('Error checking admins:', error);
    } finally {
        mongoose.connection.close();
    }
};

checkAdmins();
