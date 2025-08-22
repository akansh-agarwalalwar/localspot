const mongoose = require('mongoose');
const Mess = require('../models/Mess');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/localspot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const testMessFunctionality = async () => {
    try {
        console.log('🧪 Testing Mess Functionality...');

        // Find a test user (admin or subadmin)
        const testUser = await User.findOne({ role: { $in: ['admin', 'subadmin'] } });
        if (!testUser) {
            console.log('❌ No admin or subadmin user found. Please create one first.');
            return;
        }

        console.log(`✅ Found test user: ${testUser.username} (${testUser.role})`);

        // Create a test mess
        const testMessData = {
            title: 'Test Mess - DTU Campus',
            description: 'A test mess near DTU campus serving quality food',
            location: 'Sector 7, Rohini',
            distanceFromDTU: '500 meters',
            images: [
                'https://drive.google.com/uc?export=view&id=1XYOPonXfAJTsdirZkX2CABLg3AosFhBM'
            ],
            coverPhoto: 'https://drive.google.com/uc?export=view&id=1XYOPonXfAJTsdirZkX2CABLg3AosFhBM',
            timings: {
                breakfast: { available: true, time: '7:00 AM - 10:00 AM' },
                lunch: { available: true, time: '12:00 PM - 3:00 PM' },
                dinner: { available: true, time: '7:00 PM - 10:00 PM' },
                snacks: { available: false, time: '' }
            },
            hasAC: true,
            pricing: {
                breakfast: 50,
                lunch: 80,
                dinner: 70,
                snacks: 0
            },
            createdBy: testUser._id
        };

        const mess = new Mess(testMessData);
        await mess.save();

        console.log('✅ Test mess created successfully:');
        console.log(`   - ID: ${mess._id}`);
        console.log(`   - Title: ${mess.title}`);
        console.log(`   - Location: ${mess.location}`);
        console.log(`   - Distance from DTU: ${mess.distanceFromDTU}`);
        console.log(`   - Has AC: ${mess.hasAC}`);
        console.log(`   - Available meals: ${Object.entries(mess.timings).filter(([_, timing]) => timing.available).map(([meal]) => meal).join(', ')}`);

        // Test retrieval
        const retrievedMess = await Mess.findById(mess._id).populate('createdBy', 'username email');
        console.log('✅ Mess retrieval test passed');
        console.log(`   - Created by: ${retrievedMess.createdBy.username}`);

        // Test virtuals
        console.log('✅ Virtual fields test:');
        console.log(`   - Direct image URLs: ${retrievedMess.directImageUrls.length} images`);
        console.log(`   - Direct cover photo URL: ${retrievedMess.directCoverPhotoUrl ? 'Available' : 'Not available'}`);

        // Clean up - delete the test mess
        await Mess.findByIdAndDelete(mess._id);
        console.log('✅ Test mess cleaned up');

        console.log('\n🎉 All mess functionality tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        mongoose.connection.close();
    }
};

testMessFunctionality();
