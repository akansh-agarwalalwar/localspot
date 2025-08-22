const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testPermissionUpdate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        console.log('Connected to MongoDB');

        // Find or create a test subadmin
        let testSubadmin = await User.findOne({ email: 'testpermissions@test.com' });
        
        if (!testSubadmin) {
            console.log('Creating test subadmin...');
            testSubadmin = new User({
                username: 'testpermissions',
                email: 'testpermissions@test.com',
                password: 'test123',
                role: 'subadmin'
            });
            await testSubadmin.save();
            console.log('Test subadmin created');
        }

        console.log('Initial permissions:', testSubadmin.permissions);

        // Update permissions
        testSubadmin.permissions = {
            canCreate: true,
            canRead: true,
            canUpdate: true,
            canDelete: true
        };

        await testSubadmin.save();
        console.log('Permissions updated, saved to database');

        // Fetch the subadmin again to verify the update persisted
        const updatedSubadmin = await User.findById(testSubadmin._id);
        console.log('Permissions after save:', updatedSubadmin.permissions);

        if (updatedSubadmin.permissions.canCreate && 
            updatedSubadmin.permissions.canUpdate && 
            updatedSubadmin.permissions.canDelete) {
            console.log('✅ Test PASSED: Permissions were properly updated');
        } else {
            console.log('❌ Test FAILED: Permissions were not updated correctly');
        }

        // Clean up - delete the test user
        await User.findByIdAndDelete(testSubadmin._id);
        console.log('Test user deleted');

    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

testPermissionUpdate();
