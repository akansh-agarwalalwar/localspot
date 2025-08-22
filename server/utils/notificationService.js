const Subscription = require('../models/Subscription');

// Function to send notification emails when new properties are added
const notifySubscribers = async (propertyType, propertyDetails) => {
  try {
    // For a new startup, we'll log the notifications instead of actually sending emails
    // This can be upgraded to real email service later (like SendGrid, Nodemailer, etc.)
    
    const activeSubscriptions = await Subscription.find({ 
      isActive: true,
      [`preferences.${getPreferenceKey(propertyType)}`]: true 
    });

    console.log(`\n🔔 NEW LISTING NOTIFICATION:`);
    console.log(`📍 Property Type: ${propertyType}`);
    console.log(`🏠 Property: ${propertyDetails.title}`);
    console.log(`💰 Price: ₹${propertyDetails.price}`);
    console.log(`📍 Location: ${propertyDetails.location}`);
    console.log(`👥 Subscribers to notify: ${activeSubscriptions.length}`);
    
    if (activeSubscriptions.length > 0) {
      console.log(`📧 Email list:`);
      activeSubscriptions.forEach((sub, index) => {
        console.log(`   ${index + 1}. ${sub.email}`);
      });
      
      // Update last notified time for subscribers
      await Subscription.updateMany(
        { 
          isActive: true,
          [`preferences.${getPreferenceKey(propertyType)}`]: true 
        },
        { lastNotified: new Date() }
      );
      
      console.log(`✅ Notification sent to ${activeSubscriptions.length} subscribers`);
    } else {
      console.log(`ℹ️  No active subscribers for ${propertyType} category`);
    }

    return {
      success: true,
      notifiedCount: activeSubscriptions.length,
      propertyType,
      propertyDetails
    };

  } catch (error) {
    console.error('❌ Error sending notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to send special offers notification
const notifySpecialOffers = async (offerDetails) => {
  try {
    const activeSubscriptions = await Subscription.find({ 
      isActive: true,
      'preferences.specialOffers': true 
    });

    console.log(`\n🎉 SPECIAL OFFER NOTIFICATION:`);
    console.log(`🏷️  Offer: ${offerDetails.title}`);
    console.log(`📝 Description: ${offerDetails.description}`);
    console.log(`👥 Subscribers to notify: ${activeSubscriptions.length}`);
    
    if (activeSubscriptions.length > 0) {
      console.log(`📧 Email list:`);
      activeSubscriptions.forEach((sub, index) => {
        console.log(`   ${index + 1}. ${sub.email}`);
      });
      
      // Update last notified time for subscribers
      await Subscription.updateMany(
        { 
          isActive: true,
          'preferences.specialOffers': true 
        },
        { lastNotified: new Date() }
      );
      
      console.log(`✅ Special offer notification sent to ${activeSubscriptions.length} subscribers`);
    }

    return {
      success: true,
      notifiedCount: activeSubscriptions.length,
      offerType: 'special_offer',
      offerDetails
    };

  } catch (error) {
    console.error('❌ Error sending special offer notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to map property types to preference keys
const getPreferenceKey = (propertyType) => {
  const typeMapping = {
    'pg': 'pgHostels',
    'hostel': 'pgHostels',
    'mess': 'messCafe',
    'cafe': 'messCafe',
    'gaming': 'gamingZone',
    'room': 'pgHostels',
    'flat': 'pgHostels'
  };
  
  return typeMapping[propertyType.toLowerCase()] || 'pgHostels';
};

// Function to get notification statistics
const getNotificationStats = async () => {
  try {
    const totalSubscribers = await Subscription.countDocuments({ isActive: true });
    const recentNotifications = await Subscription.countDocuments({ 
      isActive: true,
      lastNotified: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    const preferenceCounts = await Subscription.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: null,
        pgHostels: { $sum: { $cond: ['$preferences.pgHostels', 1, 0] } },
        messCafe: { $sum: { $cond: ['$preferences.messCafe', 1, 0] } },
        gamingZone: { $sum: { $cond: ['$preferences.gamingZone', 1, 0] } },
        specialOffers: { $sum: { $cond: ['$preferences.specialOffers', 1, 0] } }
      }}
    ]);

    return {
      totalSubscribers,
      recentNotifications,
      preferences: preferenceCounts[0] || {
        pgHostels: 0,
        messCafe: 0,
        gamingZone: 0,
        specialOffers: 0
      }
    };

  } catch (error) {
    console.error('Error getting notification stats:', error);
    return null;
  }
};

module.exports = {
  notifySubscribers,
  notifySpecialOffers,
  getNotificationStats
};
