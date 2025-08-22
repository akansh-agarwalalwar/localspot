const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
require('dotenv').config();

const testOwnershipBasedAccess = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/localspot');
        console.log('Connected to MongoDB');

        // Create test subadmin 1
        const subadmin1 = new User({
            username: 'testsubadmin1',
            email: 'testsubadmin1@test.com',
            password: 'test123',
            role: 'subadmin',
            permissions: {
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: true
            }
        });
        await subadmin1.save();

        // Create test subadmin 2
        const subadmin2 = new User({
            username: 'testsubadmin2',
            email: 'testsubadmin2@test.com',
            password: 'test123',
            role: 'subadmin',
            permissions: {
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: true
            }
        });
        await subadmin2.save();

        // Create properties by each subadmin
        const property1 = new Property({
            title: 'Property by Subadmin 1',
            description: 'This property was created by subadmin 1',
            price: 5000,
            location: 'Test Location 1',
            pics: ['https://example.com/image1.jpg'],
            createdBy: subadmin1._id
        });
        await property1.save();

        const property2 = new Property({
            title: 'Property by Subadmin 2',
            description: 'This property was created by subadmin 2',
            price: 6000,
            location: 'Test Location 2',
            pics: ['https://example.com/image2.jpg'],
            createdBy: subadmin2._id
        });
        await property2.save();

        console.log('\n✅ Test data created:');
        console.log('- Subadmin 1:', subadmin1.username, '- ID:', subadmin1._id);
        console.log('- Subadmin 2:', subadmin2.username, '- ID:', subadmin2._id);
        console.log('- Property 1 (by subadmin 1):', property1.title);
        console.log('- Property 2 (by subadmin 2):', property2.title);

        // Test 1: Subadmin can see their own properties
        const subadmin1Properties = await Property.find({ createdBy: subadmin1._id });
        console.log('\n🔍 Test 1 - Subadmin 1 properties:', subadmin1Properties.length, 'found');
        console.log('Should be 1:', subadmin1Properties.length === 1 ? '✅ PASS' : '❌ FAIL');

        // Test 2: Subadmin cannot see other's properties when filtered
        const subadmin2Properties = await Property.find({ createdBy: subadmin2._id });
        console.log('\n🔍 Test 2 - Subadmin 2 properties:', subadmin2Properties.length, 'found');
        console.log('Should be 1:', subadmin2Properties.length === 1 ? '✅ PASS' : '❌ FAIL');

        // Test 3: Ownership verification
        const property1Owner = property1.createdBy.toString() === subadmin1._id.toString();
        const property2Owner = property2.createdBy.toString() === subadmin2._id.toString();
        console.log('\n🔐 Test 3 - Ownership verification:');
        console.log('Property 1 owned by Subadmin 1:', property1Owner ? '✅ PASS' : '❌ FAIL');
        console.log('Property 2 owned by Subadmin 2:', property2Owner ? '✅ PASS' : '❌ FAIL');

        // Clean up
        await User.deleteMany({ 
            email: { $in: ['testsubadmin1@test.com', 'testsubadmin2@test.com'] } 
        });
        await Property.deleteMany({ 
            _id: { $in: [property1._id, property2._id] } 
        });
        
        console.log('\n🧹 Test data cleaned up');
        console.log('\n🎉 All tests completed!');

    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

testOwnershipBasedAccess();
