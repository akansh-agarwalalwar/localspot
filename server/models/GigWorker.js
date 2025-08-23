const mongoose = require('mongoose');

const gigWorkerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid mobile number']
  },
  year: {
    type: String,
    required: [true, 'Academic year is required'],
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Post Graduate']
  },
  branch: {
    type: String,
    required: [true, 'Branch/Field of study is required'],
    trim: true,
    minlength: [2, 'Branch must be at least 2 characters long'],
    maxlength: [100, 'Branch cannot exceed 100 characters']
  },
  skills: [{
    type: String,
    enum: ['assignments', 'excel', 'documents', 'coding', 'design', 'research']
  }],
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert'],
    default: 'beginner'
  },
  hourlyRate: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
    default: 'pending'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  portfolio: {
    description: String,
    samples: [String], // URLs to work samples
    certifications: [String]
  },
  contactPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    whatsapp: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
gigWorkerSchema.index({ email: 1 });
gigWorkerSchema.index({ skills: 1 });
gigWorkerSchema.index({ status: 1 });
gigWorkerSchema.index({ isAvailable: 1 });
gigWorkerSchema.index({ rating: -1 });

// Virtual for calculating success rate
gigWorkerSchema.virtual('successRate').get(function() {
  if (this.completedProjects === 0) return 0;
  return ((this.rating * this.completedProjects) / (this.completedProjects * 5)) * 100;
});

// Pre-save middleware to update lastActive
gigWorkerSchema.pre('save', function(next) {
  if (this.isModified('status') || this.isModified('isAvailable')) {
    this.lastActive = new Date();
  }
  next();
});

// Static method to find available workers by skills
gigWorkerSchema.statics.findAvailableBySkills = function(skills) {
  return this.find({
    status: 'active',
    isAvailable: true,
    skills: { $in: skills }
  }).sort({ rating: -1, completedProjects: -1 });
};

// Instance method to calculate hourly rate range
gigWorkerSchema.methods.getHourlyRateRange = function() {
  if (!this.hourlyRate) return null;
  
  const rateStr = this.hourlyRate.toLowerCase();
  const numbers = rateStr.match(/\d+/g);
  
  if (numbers && numbers.length >= 2) {
    return {
      min: parseInt(numbers[0]),
      max: parseInt(numbers[1])
    };
  } else if (numbers && numbers.length === 1) {
    return {
      min: parseInt(numbers[0]),
      max: parseInt(numbers[0])
    };
  }
  
  return null;
};

module.exports = mongoose.model('GigWorker', gigWorkerSchema);
