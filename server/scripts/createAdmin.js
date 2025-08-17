const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        
        const adminExists = await User.findOne({ role: 'admin' });
        
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const admin = new User({
            username: 'admin',
            email: 'admin@localspot.com',
            password: 'admin123',
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log('Email: admin@localspot.com');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();
