const GamingZone = require('../models/GamingZone');
const { logActivity } = require('../utils/activityLogger');

// Create a new gaming zone
const createGamingZone = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      monthlyPrice,
      hourlyPrice,
      images,
      coverPhoto,
      amenities
    } = req.body;

    // Validate required fields
    if (!title || !description || !location || !monthlyPrice || !hourlyPrice || !coverPhoto) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create gaming zone
    const gamingZone = new GamingZone({
      title,
      description,
      location,
      monthlyPrice: Number(monthlyPrice),
      hourlyPrice: Number(hourlyPrice),
      images: images || [],
      coverPhoto,
      amenities: amenities || {},
      createdBy: req.user.id,
      isActive: true
    });

    await gamingZone.save();

    // Log activity
    await logActivity(
      req.user.id,
      'CREATE',
      'GAMING_ZONE',
      gamingZone._id.toString(),
      `Created gaming zone: ${title}`,
      req.ip,
      req.get('User-Agent')
    );

    await gamingZone.populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Gaming zone created successfully',
      gamingZone
    });
  } catch (error) {
    console.error('Create gaming zone error:', error);
    
    // Log failed activity
    if (req.user) {
      await logActivity(
        req.user.id,
        'CREATE',
        'GAMING_ZONE',
        null,
        `Failed to create gaming zone: ${error.message}`,
        req.ip,
        req.get('User-Agent'),
        'FAILED'
      );
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all gaming zones (admin)
const getAllGamingZones = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    
    // Add createdBy filter for subadmins
    if (req.query.createdBy) {
      filter.createdBy = req.query.createdBy;
    }
    
    // Add search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Add status filter
    if (req.query.status === 'active') {
      filter.isActive = true;
    } else if (req.query.status === 'inactive') {
      filter.isActive = false;
    }

    const total = await GamingZone.countDocuments(filter);
    const gamingZones = await GamingZone.find(filter)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      gamingZones,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get gaming zones error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all gaming zones (public)
const getAllGamingZonesPublic = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    
    // Add search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const total = await GamingZone.countDocuments(filter);
    const gamingZones = await GamingZone.find(filter)
      .select('-createdBy') // Don't expose creator info in public API
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      gamingZones,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get public gaming zones error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get gaming zone by ID
const getGamingZoneById = async (req, res) => {
  try {
    const gamingZone = await GamingZone.findById(req.params.id)
      .populate('createdBy', 'username email');

    if (!gamingZone) {
      return res.status(404).json({
        success: false,
        message: 'Gaming zone not found'
      });
    }

    res.json({
      success: true,
      gamingZone
    });
  } catch (error) {
    console.error('Get gaming zone error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get gaming zone by ID (public)
const getGamingZoneByIdPublic = async (req, res) => {
  try {
    const gamingZone = await GamingZone.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).select('-createdBy');

    if (!gamingZone) {
      return res.status(404).json({
        success: false,
        message: 'Gaming zone not found'
      });
    }

    res.json({
      success: true,
      gamingZone
    });
  } catch (error) {
    console.error('Get public gaming zone error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update gaming zone
const updateGamingZone = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates._id;

    // First find the gaming zone to check ownership
    const existingGamingZone = await GamingZone.findById(id);
    if (!existingGamingZone) {
      return res.status(404).json({
        success: false,
        message: 'Gaming zone not found'
      });
    }

    // Check if subadmin owns the gaming zone
    if (req.user.role === 'subadmin' && existingGamingZone.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit gaming zones that you created'
      });
    }

    const gamingZone = await GamingZone.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');

    if (!gamingZone) {
      return res.status(404).json({
        success: false,
        message: 'Gaming zone not found'
      });
    }

    // Log activity
    await logActivity(
      req.user.id,
      'UPDATE',
      'GAMING_ZONE',
      gamingZone._id.toString(),
      `Updated gaming zone: ${gamingZone.title}`,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      success: true,
      message: 'Gaming zone updated successfully',
      gamingZone
    });
  } catch (error) {
    console.error('Update gaming zone error:', error);
    
    // Log failed activity
    if (req.user) {
      await logActivity(
        req.user.id,
        'UPDATE',
        'GAMING_ZONE',
        req.params.id,
        `Failed to update gaming zone: ${error.message}`,
        req.ip,
        req.get('User-Agent'),
        'FAILED'
      );
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete gaming zone
const deleteGamingZone = async (req, res) => {
  try {
    const { id } = req.params;

    // First find the gaming zone to check ownership
    const existingGamingZone = await GamingZone.findById(id);
    if (!existingGamingZone) {
      return res.status(404).json({
        success: false,
        message: 'Gaming zone not found'
      });
    }

    // Check if subadmin owns the gaming zone
    if (req.user.role === 'subadmin' && existingGamingZone.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete gaming zones that you created'
      });
    }

    const gamingZone = await GamingZone.findByIdAndDelete(id);

    if (!gamingZone) {
      return res.status(404).json({
        success: false,
        message: 'Gaming zone not found'
      });
    }

    // Log activity
    await logActivity(
      req.user.id,
      'DELETE',
      'GAMING_ZONE',
      id,
      `Deleted gaming zone: ${gamingZone.title}`,
      req.ip,
      req.get('User-Agent')
    );

    res.json({
      success: true,
      message: 'Gaming zone deleted successfully'
    });
  } catch (error) {
    console.error('Delete gaming zone error:', error);
    
    // Log failed activity
    if (req.user) {
      await logActivity(
        req.user.id,
        'DELETE',
        'GAMING_ZONE',
        req.params.id,
        `Failed to delete gaming zone: ${error.message}`,
        req.ip,
        req.get('User-Agent'),
        'FAILED'
      );
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createGamingZone,
  getAllGamingZones,
  getAllGamingZonesPublic,
  getGamingZoneById,
  getGamingZoneByIdPublic,
  updateGamingZone,
  deleteGamingZone
};
