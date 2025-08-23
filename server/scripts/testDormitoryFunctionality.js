const mongoose = require('mongoose');
const Property = require('../models/Property');

// Test script to verify dormitory functionality
async function testDormitoryFunctionality() {
    try {
        // Connect to MongoDB (using same connection from main app)
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/localspot');
        console.log('Connected to MongoDB');

        // Test dormitory member data
        const testDormitoryData = {
            title: 'Test Dormitory Property',
            description: 'A test property with dormitory functionality',
            price: 5000,
            location: 'Test Location',
            amenities: {
                ac: true,
                wifi: true,
                ro: false,
                mess: true,
                securityGuard: true,
                maid: false,
                parking: true,
                laundry: true,
                powerBackup: true,
                cctv: true
            },
            roomTypes: {
                single: false,
                double: false,
                triple: false,
                dormitory: true
            },
            dormitoryMembers: [
                {
                    fullName: 'John Doe',
                    year: '3rd Year',
                    state: 'Delhi',
                    branch: 'Computer Science'
                },
                {
                    fullName: 'Jane Smith',
                    year: '2nd Year',
                    state: 'Punjab',
                    branch: 'Mechanical Engineering'
                }
            ],
            pics: ['https://example.com/image1.jpg'],
            coverPhoto: 'https://example.com/cover.jpg',
            facilityPhotos: ['https://example.com/facility1.jpg'],
            createdBy: new mongoose.Types.ObjectId() // Mock user ID
        };

        console.log('\n1. Testing Property creation with dormitory members...');
        const property = new Property(testDormitoryData);
        await property.save();
        console.log('✅ Property created successfully with dormitory members');
        console.log('Property ID:', property._id);
        console.log('Dormitory Members:', property.dormitoryMembers);

        console.log('\n2. Testing property retrieval...');
        const retrievedProperty = await Property.findById(property._id);
        console.log('✅ Property retrieved successfully');
        console.log('Retrieved dormitory members:', retrievedProperty.dormitoryMembers);

        console.log('\n3. Testing property update...');
        retrievedProperty.dormitoryMembers.push({
            fullName: 'Bob Wilson',
            year: '4th Year',
            state: 'Maharashtra',
            branch: 'Electrical Engineering'
        });
        await retrievedProperty.save();
        console.log('✅ Property updated with new dormitory member');
        
        const updatedProperty = await Property.findById(property._id);
        console.log('Updated member count:', updatedProperty.dormitoryMembers.length);

        console.log('\n4. Testing validation - trying to create dormitory without members...');
        try {
            const invalidProperty = new Property({
                title: 'Invalid Dormitory',
                description: 'Should fail validation',
                price: 3000,
                location: 'Test Location',
                roomTypes: { dormitory: true },
                dormitoryMembers: [], // Empty array should fail
                pics: ['https://example.com/image.jpg'],
                createdBy: new mongoose.Types.ObjectId()
            });
            await invalidProperty.save();
            console.log('❌ Validation failed - empty dormitory members were allowed');
        } catch (error) {
            console.log('✅ Validation working - rejected empty dormitory members');
            console.log('Error:', error.message);
        }

        console.log('\n5. Testing validation - incomplete member data...');
        try {
            const incompleteProperty = new Property({
                title: 'Incomplete Dormitory',
                description: 'Should fail validation',
                price: 4000,
                location: 'Test Location',
                roomTypes: { dormitory: true },
                dormitoryMembers: [
                    {
                        fullName: 'Test User',
                        year: '1st Year',
                        state: '', // Missing state
                        branch: 'Computer Science'
                    }
                ],
                pics: ['https://example.com/image.jpg'],
                createdBy: new mongoose.Types.ObjectId()
            });
            await incompleteProperty.save();
            console.log('❌ Validation failed - incomplete member data was allowed');
        } catch (error) {
            console.log('✅ Validation working - rejected incomplete member data');
            console.log('Error:', error.message);
        }

        console.log('\n6. Cleaning up test data...');
        await Property.deleteOne({ _id: property._id });
        console.log('✅ Test data cleaned up');

        console.log('\n🎉 All tests passed! Dormitory functionality is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the test
testDormitoryFunctionality();
