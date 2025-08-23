const axios = require('axios');

// Create a test property with dormitory members
async function createTestDormitoryProperty() {
    try {
        // First login as admin to get token
        const loginResponse = await axios.post('http://localhost:5004/api/auth/login', {
            email: 'admin@localspot.com',
            password: 'admin123'
        });

        const token = loginResponse.data.token;
        console.log('✅ Logged in successfully');

        // Create property with dormitory members
        const propertyData = {
            title: 'Student Dormitory - DTU Area',
            description: 'A spacious shared dormitory perfect for students. Located close to DTU campus with all modern amenities.',
            price: 4500,
            location: 'Rohini, Near DTU',
            amenities: {
                ac: true,
                wifi: true,
                ro: true,
                mess: true,
                securityGuard: true,
                maid: true,
                parking: false,
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
                    fullName: 'Rahul Sharma',
                    year: '3rd Year',
                    state: 'Delhi',
                    branch: 'Computer Science'
                },
                {
                    fullName: 'Priya Gupta',
                    year: '2nd Year',
                    state: 'Punjab',
                    branch: 'Mechanical Engineering'
                },
                {
                    fullName: 'Amit Kumar',
                    year: '4th Year',
                    state: 'Haryana',
                    branch: 'Electronics & Communication'
                }
            ],
            pics: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
            coverPhoto: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            facilityPhotos: [
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ]
        };

        const response = await axios.post('http://localhost:5004/api/properties', propertyData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Test dormitory property created successfully!');
        console.log('Property ID:', response.data.property._id);
        console.log('Dormitory Members:', response.data.property.dormitoryMembers.length);
        
        // Test fetching the property via public API
        const publicResponse = await axios.get(`http://localhost:5004/api/properties/public/${response.data.property._id}`);
        
        console.log('✅ Property fetched via public API');
        console.log('Public API includes dormitory members:', !!publicResponse.data.property.dormitoryMembers);
        console.log('Number of dormitory members:', publicResponse.data.property.dormitoryMembers?.length || 0);

        console.log('\n🎉 Test completed! You can now:');
        console.log('1. Visit http://localhost:8081/pg-hostels to see all properties');
        console.log('2. Look for the "Student Dormitory - DTU Area" property');
        console.log('3. Notice the purple dormitory badge with member count');
        console.log('4. Click "View Details" to see full member information');
        console.log('5. Click "Book Now" and select dormitory to see current residents');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Run the test
createTestDormitoryProperty();
