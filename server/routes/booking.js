const express = require('express');
const { createBooking, getUserBookings, getAllBookings } = require('../controllers/bookingController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/book', createBooking);

// Protected routes
router.get('/user/:userId', authenticateToken, getUserBookings);

// Admin routes
router.get('/all', authenticateToken, authorizeRole('admin'), getAllBookings);

module.exports = router;
