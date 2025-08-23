const GigWorker = require('../models/GigWorker');
const { validationResult } = require('express-validator');

// @desc    Register a new gig worker
// @route   POST /api/gig-workers/register
// @access  Public
const registerGigWorker = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      fullName,
      email,
      mobile,
      year,
      branch,
      skills,
      experience,
      hourlyRate
    } = req.body;

    // Check if worker already exists
    const existingWorker = await GigWorker.findOne({ email });
    if (existingWorker) {
      return res.status(400).json({
        success: false,
        message: 'A gig worker with this email already exists'
      });
    }

    // Validate skills array
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one skill must be selected'
      });
    }

    // Create new gig worker
    const gigWorker = new GigWorker({
      fullName,
      email,
      mobile,
      year,
      branch,
      skills,
      experience: experience || 'beginner',
      hourlyRate
    });

    await gigWorker.save();

    // Remove sensitive information from response
    const workerResponse = {
      id: gigWorker._id,
      fullName: gigWorker.fullName,
      email: gigWorker.email,
      year: gigWorker.year,
      branch: gigWorker.branch,
      skills: gigWorker.skills,
      experience: gigWorker.experience,
      status: gigWorker.status,
      joinedAt: gigWorker.joinedAt
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful! We will contact you soon with work opportunities.',
      data: workerResponse
    });

  } catch (error) {
    console.error('GIG Worker registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already registered'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong during registration. Please try again.'
    });
  }
};

// @desc    Get all gig workers (Admin only)
// @route   GET /api/gig-workers
// @access  Private/Admin
const getAllGigWorkers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      skills,
      experience,
      sortBy = 'joinedAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (skills) filter.skills = { $in: skills.split(',') };
    if (experience) filter.experience = experience;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [workers, total] = await Promise.all([
      GigWorker.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      GigWorker.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        workers,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          hasNext: skip + workers.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get gig workers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gig workers'
    });
  }
};

// @desc    Get gig worker by ID
// @route   GET /api/gig-workers/:id
// @access  Private/Admin
const getGigWorkerById = async (req, res) => {
  try {
    const worker = await GigWorker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Gig worker not found'
      });
    }

    res.json({
      success: true,
      data: worker
    });

  } catch (error) {
    console.error('Get gig worker by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gig worker details'
    });
  }
};

// @desc    Update gig worker status
// @route   PATCH /api/gig-workers/:id/status
// @access  Private/Admin
const updateGigWorkerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'active', 'inactive'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const worker = await GigWorker.findByIdAndUpdate(
      req.params.id,
      { status, lastActive: new Date() },
      { new: true, runValidators: true }
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Gig worker not found'
      });
    }

    res.json({
      success: true,
      message: `Worker status updated to ${status}`,
      data: worker
    });

  } catch (error) {
    console.error('Update gig worker status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update worker status'
    });
  }
};

// @desc    Get available workers by skills
// @route   GET /api/gig-workers/available
// @access  Public
const getAvailableWorkers = async (req, res) => {
  try {
    const { skills, minRating = 0 } = req.query;
    
    const filter = {
      status: 'active',
      isAvailable: true,
      rating: { $gte: parseFloat(minRating) }
    };

    if (skills) {
      filter.skills = { $in: skills.split(',') };
    }

    const workers = await GigWorker.find(filter)
      .select('fullName email skills experience rating completedProjects hourlyRate joinedAt')
      .sort({ rating: -1, completedProjects: -1 })
      .limit(20);

    res.json({
      success: true,
      data: workers
    });

  } catch (error) {
    console.error('Get available workers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available workers'
    });
  }
};

// @desc    Update worker profile
// @route   PUT /api/gig-workers/:id
// @access  Private/Admin
const updateGigWorker = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      year,
      branch,
      skills,
      experience,
      hourlyRate,
      isAvailable,
      portfolio
    } = req.body;

    const updateData = {};
    
    if (fullName) updateData.fullName = fullName;
    if (mobile) updateData.mobile = mobile;
    if (year) updateData.year = year;
    if (branch) updateData.branch = branch;
    if (skills && Array.isArray(skills)) updateData.skills = skills;
    if (experience) updateData.experience = experience;
    if (hourlyRate) updateData.hourlyRate = hourlyRate;
    if (typeof isAvailable === 'boolean') updateData.isAvailable = isAvailable;
    if (portfolio) updateData.portfolio = portfolio;

    updateData.lastActive = new Date();

    const worker = await GigWorker.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Gig worker not found'
      });
    }

    res.json({
      success: true,
      message: 'Worker profile updated successfully',
      data: worker
    });

  } catch (error) {
    console.error('Update gig worker error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update worker profile'
    });
  }
};

// @desc    Delete gig worker
// @route   DELETE /api/gig-workers/:id
// @access  Private/Admin
const deleteGigWorker = async (req, res) => {
  try {
    const worker = await GigWorker.findByIdAndDelete(req.params.id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Gig worker not found'
      });
    }

    res.json({
      success: true,
      message: 'Gig worker deleted successfully'
    });

  } catch (error) {
    console.error('Delete gig worker error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gig worker'
    });
  }
};

// @desc    Get gig worker statistics
// @route   GET /api/gig-workers/stats
// @access  Private/Admin
const getGigWorkerStats = async (req, res) => {
  try {
    const [
      totalWorkers,
      pendingWorkers,
      activeWorkers,
      skillStats
    ] = await Promise.all([
      GigWorker.countDocuments(),
      GigWorker.countDocuments({ status: 'pending' }),
      GigWorker.countDocuments({ status: 'active', isAvailable: true }),
      GigWorker.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const averageRating = await GigWorker.aggregate([
      { $match: { rating: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalWorkers,
        pendingWorkers,
        activeWorkers,
        inactiveWorkers: totalWorkers - activeWorkers - pendingWorkers,
        averageRating: averageRating[0]?.avg || 0,
        skillDistribution: skillStats
      }
    });

  } catch (error) {
    console.error('Get gig worker stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  registerGigWorker,
  getAllGigWorkers,
  getGigWorkerById,
  updateGigWorkerStatus,
  getAvailableWorkers,
  updateGigWorker,
  deleteGigWorker,
  getGigWorkerStats
};
