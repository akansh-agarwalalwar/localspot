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
                // Enhanced URL validation to accept more image URL formats
                if (!url || typeof url !== 'string') return false;
                
                // Check if it's a valid HTTP/HTTPS URL
                if (!/^https?:\/\/.+/.test(url)) return false;
                
                // Accept various image URL patterns:
                // 1. Google Drive links
                // 2. Direct image URLs with extensions
                // 3. CDN and image hosting services
                // 4. Any HTTPS URL that could potentially serve images
                
                const validPatterns = [
                    /drive\.google\.com/,                    // Google Drive
                    /googleapis\.com/,                      // Google APIs
                    /googleusercontent\.com/,               // Google User Content
                    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i, // Direct image extensions
                    /imgur\.com/,                           // Imgur
                    /cloudinary\.com/,                      // Cloudinary
                    /amazonaws\.com/,                       // AWS S3
                    /unsplash\.com/,                        // Unsplash
                    /pexels\.com/,                          // Pexels
                    /pixabay\.com/,                         // Pixabay
                    /^https:\/\/.+\..+/                     // Any valid HTTPS URL with domain
                ];
                
                return validPatterns.some(pattern => pattern.test(url));
            },
            message: 'Invalid image URL format. Please provide a valid image URL (Google Drive, direct image link, or image hosting service).'
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

// Index for better search performance
propertySchema.index({ title: 'text', location: 'text', description: 'text' });
propertySchema.index({ createdBy: 1 });
propertySchema.index({ isActive: 1 });

module.exports = mongoose.model('Property', propertySchema);
