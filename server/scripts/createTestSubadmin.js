const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createTestSubadmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        
        // Check if test subadmin already exists
        const existingSubadmin = await User.findOne({ email: 'testsubadmin@test.com' });
        if (existingSubadmin) {
            console.log('Test subadmin already exists');
            console.log('Email: testsubadmin@test.com');
            console.log('Password: test123');
            console.log('Permissions:', existingSubadmin.permissions);
            return;
        }

        // Create a subadmin with only canCreate permission
        const testSubadmin = new User({
            username: 'testsubadmin',
            email: 'testsubadmin@test.com',
            password: 'test123',
            role: 'subadmin',
            permissions: {
                canCreate: true,   // Can create properties
                canRead: true,     // Can view properties
                canUpdate: false,  // Cannot update other's properties (but can update own)
                canDelete: false   // Cannot delete other's properties (but can delete own)
            }
        });

        await testSubadmin.save();
        console.log('Test subadmin created successfully');
        console.log('Email: testsubadmin@test.com');
        console.log('Password: test123');
        console.log('Permissions:', testSubadmin.permissions);
        console.log('\nThis subadmin can:');
        console.log('✅ Create new properties');
        console.log('✅ View all properties');
        console.log('✅ Edit/Delete only properties they created');
        console.log('❌ Edit/Delete properties created by others');
        
    } catch (error) {
        console.error('Error creating test subadmin:', error);
    } finally {
        mongoose.connection.close();
    }
};

createTestSubadmin();
