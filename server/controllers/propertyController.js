const Property = require('../models/Property');
const { logActivity } = require('../utils/activityLogger');

const createProperty = async (req, res) => {
    try {
        const { title, description, price, location, pics } = req.body;

        console.log('Received property data:', { title, description, price, location, pics });

        if (!title || !description || !price || !location || !pics || pics.length === 0) {
            return res.status(400).json({ 
                message: 'All fields are required (title, description, price, location, pics)' 
            });
        }

        if (price <= 0) {
            return res.status(400).json({ message: 'Price must be greater than 0' });
        }

        // Filter out empty pic URLs and normalize Google Drive URLs
        const validPics = pics.filter(pic => pic && pic.trim() !== '').map(pic => {
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

        if (validPics.length === 0) {
            return res.status(400).json({ message: 'At least one valid image URL is required' });
        }

        console.log('Processed image URLs:', validPics);

        const property = new Property({
            title,
            description,
            price: Number(price),
            location,
            pics: validPics,
            createdBy: req.user._id
        });

        await property.save();
        await property.populate('createdBy', 'username email');

        await logActivity(req.user._id, 'CREATE', 'PROPERTY', property._id.toString(), 
            `Created property: ${title}`, req.ip, req.get('User-Agent'));

        res.status(201).json({
            message: 'Property created successfully',
            property: {
                _id: property._id,
                title: property.title,
                description: property.description,
                price: property.price,
                location: property.location,
                pics: property.pics,
                directImageUrls: property.directImageUrls,
                createdBy: property.createdBy,
                isActive: property.isActive,
                createdAt: property.createdAt,
                updatedAt: property.updatedAt
            }
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

        await logActivity(req.user._id, 'READ', 'PROPERTY', null, 
            `Retrieved properties list (page ${page})`, req.ip, req.get('User-Agent'));

        res.json({
            properties: properties.map(property => ({
                ...property.toObject(),
                directImageUrls: property.directImageUrls // Include converted URLs
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

        await logActivity(req.user._id, 'READ', 'PROPERTY', id, 
            `Retrieved property: ${property.title}`, req.ip, req.get('User-Agent'));

        res.json({ property });
    } catch (error) {
        console.error('Get property error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, location, pics, isActive } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if user owns the property or is admin
        if (property.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this property' });
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
        if (pics) {
            const validPics = pics.filter(pic => pic && pic.trim() !== '');
            if (validPics.length === 0) {
                return res.status(400).json({ message: 'At least one valid image URL is required' });
            }
            property.pics = validPics;
        }
        if (typeof isActive === 'boolean') property.isActive = isActive;

        await property.save();
        await property.populate('createdBy', 'username email');

        await logActivity(req.user._id, 'UPDATE', 'PROPERTY', id, 
            `Updated property: ${property.title}`, req.ip, req.get('User-Agent'));

        res.json({
            message: 'Property updated successfully',
            property
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

        // Check if user owns the property or is admin
        if (property.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this property' });
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
