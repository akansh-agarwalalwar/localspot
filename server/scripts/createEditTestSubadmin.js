const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createTestSubadminWithPermissions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        console.log('Connected to MongoDB');

        // Check if test subadmin already exists
        let testSubadmin = await User.findOne({ email: 'editsubadmin@test.com' });
        
        if (testSubadmin) {
            console.log('Test subadmin already exists, updating permissions...');
            testSubadmin.permissions = {
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: true
            };
            await testSubadmin.save();
        } else {
            console.log('Creating new test subadmin with edit/delete permissions...');
            testSubadmin = new User({
                username: 'editsubadmin',
                email: 'editsubadmin@test.com',
                password: 'test123',
                role: 'subadmin',
                permissions: {
                    canCreate: true,
                    canRead: true,
                    canUpdate: true,
                    canDelete: true
                }
            });
            await testSubadmin.save();
        }

        console.log('✅ Test subadmin ready:');
        console.log('Email: editsubadmin@test.com');
        console.log('Password: test123');
        console.log('Permissions:', testSubadmin.permissions);
        console.log('\n🎯 Login with these credentials to test edit/delete functionality');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

createTestSubadminWithPermissions();
