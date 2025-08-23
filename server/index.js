const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const subadminRoutes = require('./routes/subadmin');
const activityRoutes = require('./routes/activity');
const setupRoutes = require('./routes/setup');
const propertyRoutes = require('./routes/property');
const messRoutes = require('./routes/mess');
const subscriptionRoutes = require('./routes/subscription');
const bookingRoutes = require('./routes/booking');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins
    credentials: false // Set to false when using origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subadmin', subadminRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/messes', messRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/booking', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
