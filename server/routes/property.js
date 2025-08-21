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

// All routes require authentication
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

// Update property - requires canUpdate permission or ownership
router.put('/:id', 
    authorizeRole('admin', 'subadmin'),
    (req, res, next) => {
        if (req.user.role === 'admin' || req.user.permissions.canUpdate) {
            next();
        } else {
            return res.status(403).json({ message: 'Missing update permission' });
        }
    },
    updateProperty
);

// Delete property - requires canDelete permission or ownership
router.delete('/:id', 
    authorizeRole('admin', 'subadmin'),
    (req, res, next) => {
        if (req.user.role === 'admin' || req.user.permissions.canDelete) {
            next();
        } else {
            return res.status(403).json({ message: 'Missing delete permission' });
        }
    },
    deleteProperty
);

module.exports = router;
