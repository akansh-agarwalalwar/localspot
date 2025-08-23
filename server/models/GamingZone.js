const mongoose = require('mongoose');

const gamingZoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  monthlyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String,
    required: false
  }],
  coverPhoto: {
    type: String,
    required: true
  },
  amenities: {
    ac: {
      type: Boolean,
      default: false
    },
    gamingConsole: {
      type: Boolean,
      default: false
    },
    ps5: {
      type: Boolean,
      default: false
    },
    xbox: {
      type: Boolean,
      default: false
    },
    wifi: {
      type: Boolean,
      default: false
    },
    parking: {
      type: Boolean,
      default: false
    },
    powerBackup: {
      type: Boolean,
      default: false
    },
    cctv: {
      type: Boolean,
      default: false
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add indexes for better performance
gamingZoneSchema.index({ title: 'text', location: 'text', description: 'text' });
gamingZoneSchema.index({ isActive: 1 });
gamingZoneSchema.index({ createdBy: 1 });
gamingZoneSchema.index({ monthlyPrice: 1 });
gamingZoneSchema.index({ hourlyPrice: 1 });

const GamingZone = mongoose.model('GamingZone', gamingZoneSchema);

module.exports = GamingZone;
