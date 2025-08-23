const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'subadmin', 'user'],
        required: true
    },
    // Regular user specific fields
    name: {
        type: String,
        trim: true,
        maxlength: 50
    },
    branch: {
        type: String,
        trim: true,
        maxlength: 50
    },
    year: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true,
        maxlength: 50
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    },
    permissions: {
        canCreate: { type: Boolean, default: false },
        canRead: { type: Boolean, default: true },
        canUpdate: { type: Boolean, default: false },
        canDelete: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Set default permissions based on role (only when creating new user)
userSchema.pre('save', function(next) {
    // Only set default permissions if this is a new user (not being updated)
    if (this.isNew) {
        if (this.role === 'admin') {
            this.permissions = {
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: true
            };
        } else if (this.role === 'subadmin') {
            this.permissions = {
                canCreate: false,
                canRead: true,
                canUpdate: false,
                canDelete: false
            };
        } else if (this.role === 'user') {
            this.permissions = {
                canCreate: false,
                canRead: true,
                canUpdate: false,
                canDelete: false
            };
        }
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
