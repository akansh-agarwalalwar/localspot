const Mess = require('../models/Mess');
const { logActivity } = require('../utils/activityLogger');

const createMess = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            location, 
            distanceFromDTU,
            images, 
            coverPhoto, 
            timings, 
            hasAC, 
            pricing 
        } = req.body;

        console.log('Received mess data:', req.body);

        if (!title || !description || !location || !distanceFromDTU) {
            return res.status(400).json({ 
                message: 'Basic fields are required (title, description, location, distanceFromDTU)' 
            });
        }

        if (!coverPhoto || coverPhoto.trim() === '') {
            return res.status(400).json({ 
                message: 'Cover photo is required' 
            });
        }

        if (!images || images.length === 0 || !images.some(img => img && img.trim() !== '')) {
            return res.status(400).json({ 
                message: 'At least one image is required' 
            });
        }

        // Process images (convert Google Drive URLs)
        const validImages = images.filter(img => img && img.trim() !== '').map(img => {
            const trimmedImg = img.trim();
            
            if (trimmedImg.includes('drive.google.com/file/d/')) {
                const fileIdMatch = trimmedImg.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (fileIdMatch) {
                    const convertedUrl = `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
                    console.log(`Converting Google Drive URL: ${trimmedImg} -> ${convertedUrl}`);
                    return convertedUrl;
                }
            }
            
            return trimmedImg;
        });

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

        const messData = {
            title,
            description,
            location,
            distanceFromDTU,
            images: validImages,
            coverPhoto: processedCoverPhoto,
            timings: timings || {
                breakfast: { available: false, time: '' },
                lunch: { available: false, time: '' },
                dinner: { available: false, time: '' },
                snacks: { available: false, time: '' }
            },
            hasAC: hasAC || false,
            pricing: pricing || {
                breakfast: 0,
                lunch: 0,
                dinner: 0,
                snacks: 0
            },
            createdBy: req.user._id
        };

        const mess = new Mess(messData);
        await mess.save();

        await logActivity(req.user._id, 'CREATE', 'MESS', mess._id.toString(), 
            `Created mess: ${title}`, req.ip, req.get('User-Agent'));

        console.log('Mess created successfully:', mess._id);

        res.status(201).json({
            message: 'Mess created successfully',
            mess: {
                ...mess.toObject(),
                directImageUrls: mess.directImageUrls,
                directCoverPhotoUrl: mess.directCoverPhotoUrl
            }
        });
    } catch (error) {
        console.error('Create mess error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllMesses = async (req, res) => {
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

        const messes = await Mess.find(filter)
            .populate('createdBy', 'username email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Mess.countDocuments(filter);

        // Log activity only if user is authenticated
        if (req.user && req.user._id) {
            await logActivity(req.user._id, 'READ', 'MESS', null, 
                `Retrieved messes list (page ${page})`, req.ip, req.get('User-Agent'));
        }

        res.json({
            messes: messes.map(mess => {
                const messObj = mess.toObject();
                
                // Transform createdBy to have id field for frontend compatibility
                if (messObj.createdBy && messObj.createdBy._id) {
                    messObj.createdBy = {
                        ...messObj.createdBy,
                        id: messObj.createdBy._id.toString()
                    };
                }
                
                return {
                    ...messObj,
                    directImageUrls: mess.directImageUrls,
                    directCoverPhotoUrl: mess.directCoverPhotoUrl
                };
            }),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get all messes error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getMessById = async (req, res) => {
    try {
        const { id } = req.params;
        const mess = await Mess.findById(id).populate('createdBy', 'username email');

        if (!mess) {
            return res.status(404).json({ message: 'Mess not found' });
        }

        // Only log activity if user is authenticated (not for public access)
        if (req.user && req.user._id) {
            await logActivity(req.user._id, 'READ', 'MESS', id, 
                `Viewed mess: ${mess.title}`, req.ip, req.get('User-Agent'));
        }

        const messObj = mess.toObject();
        
        // Transform createdBy to have id field for frontend compatibility
        if (messObj.createdBy && messObj.createdBy._id) {
            messObj.createdBy = {
                ...messObj.createdBy,
                id: messObj.createdBy._id.toString()
            };
        }

        res.json({
            mess: {
                ...messObj,
                directImageUrls: mess.directImageUrls,
                directCoverPhotoUrl: mess.directCoverPhotoUrl
            }
        });
    } catch (error) {
        console.error('Get mess by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateMess = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, distanceFromDTU, images, coverPhoto, timings, hasAC, pricing, isActive } = req.body;

        const mess = await Mess.findById(id);
        if (!mess) {
            return res.status(404).json({ message: 'Mess not found' });
        }

        // Permission logic: same as properties
        const isAdmin = req.user.role === 'admin';
        
        // Handle both string and populated object cases for createdBy
        let creatorId;
        if (typeof mess.createdBy === 'string') {
            creatorId = mess.createdBy;
        } else if (mess.createdBy && mess.createdBy._id) {
            creatorId = mess.createdBy._id.toString();
        } else {
            creatorId = null;
        }
        
        const isOwner = creatorId === req.user._id.toString();
        
        if (isAdmin) {
            // Admin needs canUpdate permission to update any mess
            if (!req.user.permissions.canUpdate) {
                return res.status(403).json({ 
                    message: 'You need update permission to modify messes' 
                });
            }
        } else {
            // Subadmin can only update their own messes
            if (!isOwner) {
                return res.status(403).json({ 
                    message: 'You can only update messes that you created' 
                });
            }
            // Also check if subadmin has update permission
            if (!req.user.permissions.canUpdate) {
                return res.status(403).json({ 
                    message: 'You need update permission to modify messes' 
                });
            }
        }

        if (title) mess.title = title;
        if (description) mess.description = description;
        if (location) mess.location = location;
        if (distanceFromDTU) mess.distanceFromDTU = distanceFromDTU;
        if (timings) mess.timings = { ...mess.timings, ...timings };
        if (hasAC !== undefined) mess.hasAC = hasAC;
        if (pricing) mess.pricing = { ...mess.pricing, ...pricing };
        if (isActive !== undefined) mess.isActive = isActive;
        
        // Handle images
        if (images) {
            const validImages = images.filter(img => img && img.trim() !== '');
            if (validImages.length === 0) {
                return res.status(400).json({ message: 'At least one valid image URL is required' });
            }
            mess.images = validImages;
        }
        
        // Handle cover photo
        if (coverPhoto !== undefined) {
            if (coverPhoto.trim() === '') {
                return res.status(400).json({ message: 'Cover photo is required' });
            } else {
                mess.coverPhoto = coverPhoto.trim();
            }
        }

        await mess.save();

        await logActivity(req.user._id, 'UPDATE', 'MESS', id, 
            `Updated mess: ${mess.title}`, req.ip, req.get('User-Agent'));

        res.json({
            message: 'Mess updated successfully',
            mess: {
                ...mess.toObject(),
                directImageUrls: mess.directImageUrls,
                directCoverPhotoUrl: mess.directCoverPhotoUrl
            }
        });
    } catch (error) {
        console.error('Update mess error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteMess = async (req, res) => {
    try {
        const { id } = req.params;
        const mess = await Mess.findById(id);

        if (!mess) {
            return res.status(404).json({ message: 'Mess not found' });
        }

        // Permission logic: same as properties
        const isAdmin = req.user.role === 'admin';
        
        // Handle both string and populated object cases for createdBy
        let creatorId;
        if (typeof mess.createdBy === 'string') {
            creatorId = mess.createdBy;
        } else if (mess.createdBy && mess.createdBy._id) {
            creatorId = mess.createdBy._id.toString();
        } else {
            creatorId = null;
        }
        
        const isOwner = creatorId === req.user._id.toString();
        
        if (isAdmin) {
            // Admin needs canDelete permission to delete any mess
            if (!req.user.permissions.canDelete) {
                return res.status(403).json({ 
                    message: 'You need delete permission to remove messes' 
                });
            }
        } else {
            // Subadmin can only delete their own messes
            if (!isOwner) {
                return res.status(403).json({ 
                    message: 'You can only delete messes that you created' 
                });
            }
            // Also check if subadmin has delete permission
            if (!req.user.permissions.canDelete) {
                return res.status(403).json({ 
                    message: 'You need delete permission to remove messes' 
                });
            }
        }

        await Mess.findByIdAndDelete(id);

        await logActivity(req.user._id, 'DELETE', 'MESS', id, 
            `Deleted mess: ${mess.title}`, req.ip, req.get('User-Agent'));

        res.json({ message: 'Mess deleted successfully' });
    } catch (error) {
        console.error('Delete mess error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createMess,
    getAllMesses,
    getMessById,
    updateMess,
    deleteMess
};
