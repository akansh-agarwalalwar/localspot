const mongoose = require('mongoose');
const Property = require('../models/Property');
const User = require('../models/User');
require('dotenv').config();

const sampleProperties = [
    {
        title: "Luxury 2BHK Apartment",
        description: "Spacious 2BHK apartment with modern amenities, fully furnished with AC, WiFi, and kitchen facilities. Located in prime area with easy access to markets and transportation.",
        price: 25000,
        location: "Koramangala, Delhi",
        pics: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
        ]
    },
    {
        title: "Cozy 1BHK Studio",
        description: "Perfect for single occupancy or couples. Fully furnished with all modern amenities including WiFi, AC, and kitchen. Very safe and secure locality.",
        price: 15000,
        location: "HSR Layout, Delhi",
        pics: [
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
        ]
    },
    {
        title: "Shared PG for Boys",
        description: "Clean and hygienic PG accommodation with 3 meals, WiFi, laundry, and housekeeping. Great community of working professionals.",
        price: 8000,
        location: "Electronic City, Delhi",
        pics: [
            "https://images.unsplash.com/photo-1555854877-bab0e460b1e1?w=800"
        ]
    }
];

const seedProperties = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Find an admin user to assign as creator
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('No admin user found. Please create an admin first.');
            return;
        }

        // Clear existing properties
        await Property.deleteMany({});
        
        // Create sample properties
        const properties = sampleProperties.map(prop => ({
            ...prop,
            createdBy: admin._id
        }));

        await Property.insertMany(properties);
        
        console.log(`${properties.length} sample properties created successfully!`);
        
    } catch (error) {
        console.error('Error seeding properties:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedProperties();
