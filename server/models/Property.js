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
    // Amenities available at the property
    amenities: {
        ac: { type: Boolean, default: false },
        wifi: { type: Boolean, default: false },
        ro: { type: Boolean, default: false }, // RO Water
        mess: { type: Boolean, default: false },
        securityGuard: { type: Boolean, default: false },
        maid: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        laundry: { type: Boolean, default: false },
        powerBackup: { type: Boolean, default: false },
        cctv: { type: Boolean, default: false }
    },
    // Room types available
    roomTypes: {
        single: { type: Boolean, default: false },
        double: { type: Boolean, default: false },
        triple: { type: Boolean, default: false },
        dormitory: { type: Boolean, default: false }
    },
    // Dormitory members information (only if dormitory is selected)
    dormitoryMembers: [{
        fullName: {
            type: String,
            required: function() { return this.roomTypes.dormitory; },
            trim: true,
            maxlength: 100
        },
        year: {
            type: String,
            required: function() { return this.roomTypes.dormitory; },
            trim: true,
            maxlength: 50
        },
        state: {
            type: String,
            required: function() { return this.roomTypes.dormitory; },
            trim: true,
            maxlength: 100
        },
        branch: {
            type: String,
            required: function() { return this.roomTypes.dormitory; },
            trim: true,
            maxlength: 100
        }
    }],
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
    // New photo structure
    coverPhoto: {
        type: String,
        required: false, // Making it optional for backward compatibility, but will be required in frontend
        validate: {
            validator: function(url) {
                if (!url || url.trim() === '') return true; // Allow empty for backward compatibility
                if (typeof url !== 'string') return false;
                
                // Check if it's a valid HTTP/HTTPS URL
                if (!/^https?:\/\/.+/.test(url)) return false;
                
                const validPatterns = [
                    /drive\.google\.com/,
                    /googleapis\.com/,
                    /googleusercontent\.com/,
                    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i,
                    /imgur\.com/,
                    /cloudinary\.com/,
                    /amazonaws\.com/,
                    /unsplash\.com/,
                    /pexels\.com/,
                    /pixabay\.com/,
                    /^https:\/\/.+\..+/
                ];
                
                return validPatterns.some(pattern => pattern.test(url));
            },
            message: 'Invalid cover photo URL format.'
        }
    },
    facilityPhotos: [{
        type: String,
        required: false,
        validate: {
            validator: function(url) {
                if (!url || url.trim() === '') return true; // Allow empty strings
                if (typeof url !== 'string') return false;
                
                // Check if it's a valid HTTP/HTTPS URL
                if (!/^https?:\/\/.+/.test(url)) return false;
                
                const validPatterns = [
                    /drive\.google\.com/,
                    /googleapis\.com/,
                    /googleusercontent\.com/,
                    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i,
                    /imgur\.com/,
                    /cloudinary\.com/,
                    /amazonaws\.com/,
                    /unsplash\.com/,
                    /pexels\.com/,
                    /pixabay\.com/,
                    /^https:\/\/.+\..+/
                ];
                
                return validPatterns.some(pattern => pattern.test(url));
            },
            message: 'Invalid facility photo URL format.'
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

// Helper method to get direct cover photo URL
propertySchema.methods.getDirectCoverPhotoUrl = function() {
    if (!this.coverPhoto) return null;
    
    if (this.coverPhoto.includes('drive.google.com/file/d/')) {
        const fileId = this.coverPhoto.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (fileId) {
            return `https://drive.google.com/uc?export=view&id=${fileId[1]}`;
        }
    }
    return this.coverPhoto;
};

// Helper method to get direct facility photo URLs
propertySchema.methods.getDirectFacilityPhotoUrls = function() {
    if (!this.facilityPhotos || this.facilityPhotos.length === 0) return [];
    
    return this.facilityPhotos.filter(pic => pic && pic.trim() !== '').map(pic => {
        if (pic.includes('drive.google.com/file/d/')) {
            const fileId = pic.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (fileId) {
                return `https://drive.google.com/uc?export=view&id=${fileId[1]}`;
            }
        }
        return pic;
    });
};

// Virtual field for direct image URLs (legacy)
propertySchema.virtual('directImageUrls').get(function() {
    return this.getDirectImageUrls();
});

// Virtual field for direct cover photo URL
propertySchema.virtual('directCoverPhotoUrl').get(function() {
    return this.getDirectCoverPhotoUrl();
});

// Virtual field for direct facility photo URLs
propertySchema.virtual('directFacilityPhotoUrls').get(function() {
    return this.getDirectFacilityPhotoUrls();
});

// Ensure virtual fields are serialized
propertySchema.set('toJSON', { virtuals: true });
propertySchema.set('toObject', { virtuals: true });

// Index for better search performance
propertySchema.index({ title: 'text', location: 'text', description: 'text' });
propertySchema.index({ createdBy: 1 });
propertySchema.index({ isActive: 1 });

module.exports = mongoose.model('Property', propertySchema);
