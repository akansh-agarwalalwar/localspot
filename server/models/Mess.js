const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
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
        required: true,
        trim: true
    },
    distanceFromDTU: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String,
        required: true
    }],
    coverPhoto: {
        type: String,
        required: true
    },
    timings: {
        breakfast: {
            available: { type: Boolean, default: false },
            time: { type: String, default: '' }
        },
        lunch: {
            available: { type: Boolean, default: false },
            time: { type: String, default: '' }
        },
        dinner: {
            available: { type: Boolean, default: false },
            time: { type: String, default: '' }
        },
        snacks: {
            available: { type: Boolean, default: false },
            time: { type: String, default: '' }
        }
    },
    hasAC: {
        type: Boolean,
        default: false
    },
    pricing: {
        breakfast: { type: Number, default: 0 },
        lunch: { type: Number, default: 0 },
        dinner: { type: Number, default: 0 },
        snacks: { type: Number, default: 0 }
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

// Virtual for direct image URLs (similar to properties)
messSchema.virtual('directImageUrls').get(function() {
    return this.images.map(image => {
        if (image.includes('drive.google.com/file/d/')) {
            const fileIdMatch = image.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (fileIdMatch) {
                return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
            }
        }
        return image;
    });
});

// Virtual for direct cover photo URL
messSchema.virtual('directCoverPhotoUrl').get(function() {
    if (this.coverPhoto && this.coverPhoto.includes('drive.google.com/file/d/')) {
        const fileIdMatch = this.coverPhoto.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (fileIdMatch) {
            return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
        }
    }
    return this.coverPhoto;
});

messSchema.set('toJSON', { virtuals: true });
messSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Mess', messSchema);
