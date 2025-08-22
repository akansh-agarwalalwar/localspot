const express = require('express');
const {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
} = require('../controllers/propertyController');
const { authenticateToken, authorizeRole, authorizePermission } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.get('/public', getAllProperties); // Public access to view properties
router.get('/public/:id', getPropertyById); // Public access to view individual property

// All admin routes require authentication
router.use(authenticateToken);

// Admin can access all properties
router.get('/', authorizeRole('admin', 'subadmin'), getAllProperties);
router.get('/:id', authorizeRole('admin', 'subadmin'), getPropertyById);

// Create property - requires canCreate permission
router.post('/', 
    authorizeRole('admin', 'subadmin'),
    (req, res, next) => {
        if (req.user.role === 'admin' || req.user.permissions.canCreate) {
            next();
        } else {
            return res.status(403).json({ message: 'Missing create permission' });
        }
    },
    createProperty
);

// Update property - requires canUpdate permission OR ownership (for subadmins)
router.put('/:id', 
    authorizeRole('admin', 'subadmin'),
    updateProperty
);

// Delete property - requires canDelete permission OR ownership (for subadmins)
router.delete('/:id', 
    authorizeRole('admin', 'subadmin'),
    deleteProperty
);

module.exports = router;
