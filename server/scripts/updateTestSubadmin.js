const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateTestSubadmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        
        const testSubadmin = await User.findOne({ email: 'testsubadmin@test.com' });
        if (!testSubadmin) {
            console.log('Test subadmin not found');
            return;
        }

        // Update permissions
        testSubadmin.permissions = {
            canCreate: true,   // Can create properties
            canRead: true,     // Can view properties
            canUpdate: false,  // Cannot update other's properties (but can update own)
            canDelete: false   // Cannot delete other's properties (but can delete own)
        };

        await testSubadmin.save();
        console.log('Test subadmin updated successfully');
        console.log('Email: testsubadmin@test.com');
        console.log('Password: test123');
        console.log('Updated Permissions:', testSubadmin.permissions);
        console.log('\nThis subadmin can now:');
        console.log('✅ Create new properties');
        console.log('✅ View all properties');
        console.log('✅ Edit/Delete only properties they created');
        console.log('❌ Edit/Delete properties created by others');
        
    } catch (error) {
        console.error('Error updating test subadmin:', error);
    } finally {
        mongoose.connection.close();
    }
};

updateTestSubadmin();
