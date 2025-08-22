const Subscription = require('../models/Subscription');
const { logActivity } = require('../utils/activityLogger');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our newsletter'
        });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = new Date();
        await existingSubscription.save();
        
        await logActivity('Subscription Reactivated', `Email: ${email}`, null, 'system');
        
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
    }

    // Create new subscription
    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    await logActivity('New Subscription', `Email: ${email}`, null, 'system');

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed! You\'ll receive updates about new listings and offers.'
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.'
    });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const subscription = await Subscription.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our subscription list'
      });
    }

    subscription.isActive = false;
    await subscription.save();

    await logActivity('Subscription Cancelled', `Email: ${email}`, null, 'system');

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe. Please try again later.'
    });
  }
};

// Get subscription status
const getSubscriptionStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const subscription = await Subscription.findOne({ email });
    
    res.status(200).json({
      success: true,
      isSubscribed: subscription ? subscription.isActive : false,
      subscription: subscription || null
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check subscription status'
    });
  }
};

// Get all subscriptions (admin only)
const getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 50, active = 'true' } = req.query;
    
    const filter = { isActive: active === 'true' };
    
    const subscriptions = await Subscription.find(filter)
      .select('-__v')
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Subscription.countDocuments(filter);

    res.status(200).json({
      success: true,
      subscriptions,
      totalSubscriptions: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Get all subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions'
    });
  }
};

// Update subscription preferences
const updatePreferences = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const subscription = await Subscription.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.preferences = { ...subscription.preferences, ...preferences };
    await subscription.save();

    await logActivity('Subscription Preferences Updated', `Email: ${email}`, null, 'system');

    res.status(200).json({
      success: true,
      message: 'Subscription preferences updated successfully',
      preferences: subscription.preferences
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getSubscriptionStatus,
  getAllSubscriptions,
  updatePreferences
};
