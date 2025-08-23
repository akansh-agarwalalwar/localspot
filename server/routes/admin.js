const express = require('express');
const {
    createSubadmin,
    getAllSubadmins,
    getSubadminById,
    updateSubadmin,
    deleteSubadmin,
    getAllUsers,
    updateUserRole,
    toggleUserStatus
} = require('../controllers/adminController');
const { authenticateToken, authorizeRole, authorizePermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole('admin'));

// Subadmin routes
router.post('/subadmins', authorizePermission('canCreate'), createSubadmin);
router.get('/subadmins', authorizePermission('canRead'), getAllSubadmins);
router.get('/subadmins/:id', authorizePermission('canRead'), getSubadminById);
router.put('/subadmins/:id', authorizePermission('canUpdate'), updateSubadmin);
router.delete('/subadmins/:id', authorizePermission('canDelete'), deleteSubadmin);

// User management routes
router.get('/users', authorizePermission('canRead'), getAllUsers);
router.put('/users/:id/role', authorizePermission('canUpdate'), updateUserRole);
router.put('/users/:id/status', authorizePermission('canUpdate'), toggleUserStatus);

module.exports = router;
