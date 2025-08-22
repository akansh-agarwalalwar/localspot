const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateTestSubadminForce = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        
        // Use updateOne to bypass the pre-save middleware
        const result = await User.updateOne(
            { email: 'testsubadmin@test.com' },
            {
                $set: {
                    'permissions.canCreate': true,
                    'permissions.canRead': true,
                    'permissions.canUpdate': false,
                    'permissions.canDelete': false
                }
            }
        );

        if (result.matchedCount === 0) {
            console.log('Test subadmin not found');
            return;
        }

        const updatedSubadmin = await User.findOne({ email: 'testsubadmin@test.com' });
        console.log('Test subadmin permissions updated successfully');
        console.log('Email: testsubadmin@test.com');
        console.log('Password: test123');
        console.log('Updated Permissions:', updatedSubadmin.permissions);
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

updateTestSubadminForce();
