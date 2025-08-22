const Property = require('../models/Property');
const { logActivity } = require('../utils/activityLogger');
const { notifySubscribers } = require('../utils/notificationService');

const createProperty = async (req, res) => {
    try {
        const { title, description, price, location, pics, coverPhoto, facilityPhotos, amenities, roomTypes } = req.body;

        console.log('Received property data:', { title, description, price, location, pics, coverPhoto, facilityPhotos, amenities, roomTypes });

        if (!title || !description || !price || !location) {
            return res.status(400).json({ 
                message: 'Basic fields are required (title, description, price, location)' 
            });
        }

        if (price <= 0) {
            return res.status(400).json({ message: 'Price must be greater than 0' });
        }

        // Ensure we have either legacy pics or new photo structure
        if ((!pics || pics.length === 0 || !pics.some(pic => pic && pic.trim() !== '')) && 
            (!coverPhoto || coverPhoto.trim() === '')) {
            return res.status(400).json({ 
                message: 'At least one image is required (either legacy pics or cover photo)' 
            });
        }

        // Process legacy pics (for backward compatibility)
        let validPics = [];
        if (pics && pics.length > 0) {
            validPics = pics.filter(pic => pic && pic.trim() !== '').map(pic => {
                const trimmedPic = pic.trim();
                
                // Convert Google Drive sharing URL to direct view URL if needed
                if (trimmedPic.includes('drive.google.com/file/d/')) {
                    const fileIdMatch = trimmedPic.match(/\/d\/([a-zA-Z0-9-_]+)/);
                    if (fileIdMatch) {
                        const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                        console.log(`Converting Google Drive URL: ${trimmedPic} -> ${convertedUrl}`);
                        return convertedUrl;
                    }
                }
                
                console.log(`Using original URL: ${trimmedPic}`);
                return trimmedPic;
            });
        }

        // Process cover photo
        let processedCoverPhoto = '';
        if (coverPhoto && coverPhoto.trim() !== '') {
            const trimmedCoverPhoto = coverPhoto.trim();
            if (trimmedCoverPhoto.includes('drive.google.com/file/d/')) {
                const fileIdMatch = trimmedCoverPhoto.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (fileIdMatch) {
                    processedCoverPhoto = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                    console.log(`Converting cover photo URL: ${trimmedCoverPhoto} -> ${processedCoverPhoto}`);
                } else {
                    processedCoverPhoto = trimmedCoverPhoto;
                }
            } else {
                processedCoverPhoto = trimmedCoverPhoto;
            }
        }

        // Process facility photos
        let processedFacilityPhotos = [];
        if (facilityPhotos && facilityPhotos.length > 0) {
            processedFacilityPhotos = facilityPhotos.filter(pic => pic && pic.trim() !== '').map(pic => {
                const trimmedPic = pic.trim();
                
                if (trimmedPic.includes('drive.google.com/file/d/')) {
                    const fileIdMatch = trimmedPic.match(/\/d\/([a-zA-Z0-9-_]+)/);
                    if (fileIdMatch) {
                        const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                        console.log(`Converting facility photo URL: ${trimmedPic} -> ${convertedUrl}`);
                        return convertedUrl;
                    }
                }
                
                return trimmedPic;
            });
        }

        console.log('Processed image URLs:', { validPics, processedCoverPhoto, processedFacilityPhotos });

        // Create property data - ensure legacy pics for backward compatibility
        const propertyData = {
            title,
            description,
            price: Number(price),
            location,
            pics: validPics.length > 0 ? validPics : [processedCoverPhoto || ''], // Fallback to cover photo if no legacy pics
            amenities: amenities || {
                ac: false,
                wifi: false,
                ro: false,
                mess: false,
                securityGuard: false,
                maid: false,
                parking: false,
                laundry: false,
                powerBackup: false,
                cctv: false
            },
            roomTypes: roomTypes || {
                single: false,
                double: false,
                triple: false,
                dormitory: false
            },
            createdBy: req.user._id
        };

        // Add new photo fields if provided
        if (processedCoverPhoto) {
            propertyData.coverPhoto = processedCoverPhoto;
        }
        if (processedFacilityPhotos.length > 0) {
            propertyData.facilityPhotos = processedFacilityPhotos;
        }

        const property = new Property(propertyData);

        await property.save();
        await property.populate('createdBy', 'username email');

        await logActivity(req.user._id, 'CREATE', 'PROPERTY', property._id.toString(), 
            `Created property: ${title}`, req.ip, req.get('User-Agent'));

        // Send notification to subscribers
        const notificationResult = await notifySubscribers('pg', {
            title: property.title,
            price: property.price,
            location: property.location,
            description: property.description
        });

        res.status(201).json({
            message: 'Property created successfully',
            property: {
                _id: property._id,
                title: property.title,
                description: property.description,
                price: property.price,
                location: property.location,
                pics: property.pics,
                coverPhoto: property.coverPhoto,
                facilityPhotos: property.facilityPhotos,
                amenities: property.amenities,
                roomTypes: property.roomTypes,
                directImageUrls: property.directImageUrls,
                directCoverPhotoUrl: property.directCoverPhotoUrl,
                directFacilityPhotoUrls: property.directFacilityPhotoUrls,
                createdBy: property.createdBy,
                isActive: property.isActive,
                createdAt: property.createdAt,
                updatedAt: property.updatedAt
            },
            notification: notificationResult
        });
    } catch (error) {
        console.error('Create property error:', error);
        
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validationErrors,
                details: error.errors
            });
        }
        
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllProperties = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const { search, isActive, createdBy } = req.query;

        const filter = {};
        
        // Search in title, description, and location
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        if (createdBy) {
            filter.createdBy = createdBy;
        }

        const properties = await Property.find(filter)
            .populate('createdBy', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Property.countDocuments(filter);

        // Log activity only if user is authenticated
        if (req.user && req.user._id) {
            await logActivity(req.user._id, 'READ', 'PROPERTY', null, 
                `Retrieved properties list (page ${page})`, req.ip, req.get('User-Agent'));
        }

        res.json({
            properties: properties.map(property => ({
                ...property.toObject(),
                directImageUrls: property.directImageUrls, // Include converted URLs
                directCoverPhotoUrl: property.directCoverPhotoUrl, // Include converted cover photo
                directFacilityPhotoUrls: property.directFacilityPhotoUrls // Include converted facility photos
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get properties error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id)
            .populate('createdBy', 'username email');

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Log activity only if user is authenticated
        if (req.user && req.user._id) {
            await logActivity(req.user._id, 'READ', 'PROPERTY', id, 
                `Retrieved property: ${property.title}`, req.ip, req.get('User-Agent'));
        }

        res.json({ 
            property: {
                ...property.toObject(),
                directImageUrls: property.directImageUrls,
                directCoverPhotoUrl: property.directCoverPhotoUrl,
                directFacilityPhotoUrls: property.directFacilityPhotoUrls
            }
        });
    } catch (error) {
        console.error('Get property error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, location, pics, coverPhoto, facilityPhotos, amenities, roomTypes, isActive } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Permission logic:
        // 1. Admin can update any property
        // 2. Subadmin can update if they have canUpdate permission OR if they own the property
        const isAdmin = req.user.role === 'admin';
        const isOwner = property.createdBy.toString() === req.user._id.toString();
        const hasUpdatePermission = req.user.permissions.canUpdate;
        
        if (!isAdmin && !isOwner && !hasUpdatePermission) {
            return res.status(403).json({ 
                message: 'You can only update properties you created or need update permission' 
            });
        }

        if (title) property.title = title;
        if (description) property.description = description;
        if (price !== undefined) {
            if (price <= 0) {
                return res.status(400).json({ message: 'Price must be greater than 0' });
            }
            property.price = Number(price);
        }
        if (location) property.location = location;
        if (amenities) {
            property.amenities = { ...property.amenities, ...amenities };
        }
        if (roomTypes) {
            property.roomTypes = { ...property.roomTypes, ...roomTypes };
        }
        
        // Handle legacy pics
        if (pics) {
            const validPics = pics.filter(pic => pic && pic.trim() !== '');
            if (validPics.length === 0) {
                return res.status(400).json({ message: 'At least one valid image URL is required' });
            }
            property.pics = validPics;
        }
        
        // Handle new cover photo
        if (coverPhoto !== undefined) {
            if (coverPhoto.trim() === '') {
                property.coverPhoto = '';
            } else {
                property.coverPhoto = coverPhoto.trim();
            }
        }
        
        // Handle new facility photos
        if (facilityPhotos !== undefined) {
            const validFacilityPhotos = facilityPhotos.filter(pic => pic && pic.trim() !== '');
            property.facilityPhotos = validFacilityPhotos;
        }
        
        if (typeof isActive === 'boolean') property.isActive = isActive;

        await property.save();
        await property.populate('createdBy', 'username email');

        await logActivity(req.user._id, 'UPDATE', 'PROPERTY', id, 
            `Updated property: ${property.title}`, req.ip, req.get('User-Agent'));

        res.json({
            message: 'Property updated successfully',
            property: {
                ...property.toObject(),
                directImageUrls: property.directImageUrls,
                directCoverPhotoUrl: property.directCoverPhotoUrl,
                directFacilityPhotoUrls: property.directFacilityPhotoUrls
            }
        });
    } catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Permission logic:
        // 1. Admin can delete any property
        // 2. Subadmin can delete if they have canDelete permission OR if they own the property
        const isAdmin = req.user.role === 'admin';
        const isOwner = property.createdBy.toString() === req.user._id.toString();
        const hasDeletePermission = req.user.permissions.canDelete;
        
        if (!isAdmin && !isOwner && !hasDeletePermission) {
            return res.status(403).json({ 
                message: 'You can only delete properties you created or need delete permission' 
            });
        }

        await Property.findByIdAndDelete(id);

        await logActivity(req.user._id, 'DELETE', 'PROPERTY', id, 
            `Deleted property: ${property.title}`, req.ip, req.get('User-Agent'));

        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};
