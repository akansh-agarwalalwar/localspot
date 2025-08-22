const Booking = require('../models/Booking');
const Property = require('../models/Property');
const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');

const createBooking = async (req, res) => {
    try {
        const { 
            propertyId, 
            propertyType, 
            checkInDate, 
            checkOutDate, 
            totalAmount, 
            contactDetails, 
            notes,
            userDetails 
        } = req.body;

        if (!propertyId || !propertyType || !checkInDate || !totalAmount || !contactDetails || !userDetails) {
            return res.status(400).json({ 
                message: 'Property ID, type, check-in date, total amount, contact details, and user details are required' 
            });
        }

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Create or find user based on email
        let user = await User.findOne({ email: contactDetails.email });
        if (!user) {
            // Create a basic user account for booking
            user = new User({
                username: userDetails.name || contactDetails.email.split('@')[0],
                email: contactDetails.email,
                password: 'temp123', // They can reset this later
                role: 'user'
            });
            await user.save();
            
            await logActivity(user._id, 'SIGNUP', 'USER', user._id.toString(), 
                `New user registered via booking: ${user.username} (${user.email})`, req.ip, req.get('User-Agent'));
        }

        const booking = new Booking({
            userId: user._id,
            propertyId,
            propertyType,
            checkInDate: new Date(checkInDate),
            checkOutDate: checkOutDate ? new Date(checkOutDate) : null,
            totalAmount,
            contactDetails,
            notes: notes || '',
            status: 'pending'
        });

        await booking.save();
        await booking.populate([
            { path: 'userId', select: 'username email' },
            { path: 'propertyId', select: 'title location price' }
        ]);

        await logActivity(user._id, 'BOOKING', 'PROPERTY', propertyId, 
            `${user.username} booked ${property.title} (${propertyType})`, req.ip, req.get('User-Agent'));

        res.status(201).json({
            message: 'Booking created successfully',
            booking: {
                id: booking._id,
                propertyId: booking.propertyId,
                propertyType: booking.propertyType,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
                totalAmount: booking.totalAmount,
                status: booking.status,
                createdAt: booking.createdAt
            }
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const bookings = await Booking.find({ userId })
            .populate('propertyId', 'title location price pics')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Booking.countDocuments({ userId });

        res.json({
            bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const bookings = await Booking.find()
            .populate('userId', 'username email')
            .populate('propertyId', 'title location price')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Booking.countDocuments();

        await logActivity(req.user._id, 'READ', 'BOOKING', null, 
            `Retrieved bookings list (page ${page})`, req.ip, req.get('User-Agent'));

        res.json({
            bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getAllBookings
};
