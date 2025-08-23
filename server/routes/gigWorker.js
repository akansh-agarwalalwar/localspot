const express = require('express');
const { body } = require('express-validator');
const {
  registerGigWorker,
  getAllGigWorkers,
  getGigWorkerById,
  updateGigWorkerStatus,
  getAvailableWorkers,
  updateGigWorker,
  deleteGigWorker,
  getGigWorkerStats
} = require('../controllers/gigWorkerController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const gigWorkerValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('mobile')
    .isMobilePhone()
    .withMessage('Please provide a valid mobile number'),
  body('year')
    .isIn(['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Post Graduate'])
    .withMessage('Please select a valid academic year'),
  body('branch')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Branch must be between 2 and 100 characters'),
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill must be selected')
    .custom((skills) => {
      const validSkills = ['assignments', 'excel', 'documents', 'coding', 'design', 'research'];
      return skills.every(skill => validSkills.includes(skill));
    })
    .withMessage('Invalid skill selection'),
  body('experience')
    .optional()
    .isIn(['beginner', 'intermediate', 'expert'])
    .withMessage('Invalid experience level'),
  body('hourlyRate')
    .optional()
    .trim()
];

// @route   POST /api/gig-workers/register
// @desc    Register a new gig worker
// @access  Public
router.post('/register', gigWorkerValidation, registerGigWorker);

// @route   GET /api/gig-workers/available
// @desc    Get available workers by skills
// @access  Public
router.get('/available', getAvailableWorkers);

// @route   GET /api/gig-workers/stats
// @desc    Get gig worker statistics
// @access  Private/Admin
router.get('/stats', authenticateToken, authorizeRole('admin'), getGigWorkerStats);

// @route   GET /api/gig-workers
// @desc    Get all gig workers with filtering and pagination
// @access  Private/Admin
router.get('/', authenticateToken, authorizeRole('admin'), getAllGigWorkers);

// @route   GET /api/gig-workers/:id
// @desc    Get gig worker by ID
// @access  Private/Admin
router.get('/:id', authenticateToken, authorizeRole('admin'), getGigWorkerById);

// @route   PATCH /api/gig-workers/:id/status
// @desc    Update gig worker status
// @access  Private/Admin
router.patch('/:id/status', 
  authenticateToken,
  authorizeRole('admin'),
  body('status')
    .isIn(['pending', 'approved', 'rejected', 'active', 'inactive'])
    .withMessage('Invalid status value'),
  updateGigWorkerStatus
);

// @route   PUT /api/gig-workers/:id
// @desc    Update gig worker profile
// @access  Private/Admin
router.put('/:id', authenticateToken, authorizeRole('admin'), updateGigWorker);

// @route   DELETE /api/gig-workers/:id
// @desc    Delete gig worker
// @access  Private/Admin
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteGigWorker);

module.exports = router;
