const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  lastNotified: {
    type: Date,
    default: null
  },
  preferences: {
    pgHostels: {
      type: Boolean,
      default: true
    },
    messCafe: {
      type: Boolean,
      default: true
    },
    gamingZone: {
      type: Boolean,
      default: true
    },
    specialOffers: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Index for faster email lookups
subscriptionSchema.index({ email: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
