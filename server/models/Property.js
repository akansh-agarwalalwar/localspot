const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    pics: [{
        type: String,
        required: true,
        validate: {
            validator: function(url) {
                // Enhanced validation for Google Drive links and other image URLs
                return /^https?:\/\/.+/.test(url) && 
                       (url.includes('drive.google.com') || 
                        url.includes('googleapis.com') ||
                        /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
            },
            message: 'Invalid image URL format. Please provide Google Drive links or direct image URLs.'
        }
    }],
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

// Index for better search performance
propertySchema.index({ title: 'text', location: 'text', description: 'text' });
propertySchema.index({ createdBy: 1 });
propertySchema.index({ isActive: 1 });

// Helper method to convert Google Drive sharing link to direct image URL
propertySchema.methods.getDirectImageUrls = function() {
    return this.pics.map(pic => {
        if (pic.includes('drive.google.com/file/d/')) {
            // Extract file ID from Google Drive sharing link
            const fileId = pic.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (fileId) {
                // Convert to direct image URL
                return `https://drive.google.com/uc?export=view&id=${fileId[1]}`;
            }
        }
        return pic; // Return original URL if not a Google Drive link
    });
};

// Virtual field for direct image URLs
propertySchema.virtual('directImageUrls').get(function() {
    return this.getDirectImageUrls();
});

// Ensure virtual fields are serialized
propertySchema.set('toJSON', { virtuals: true });
propertySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Property', propertySchema);
