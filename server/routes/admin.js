const express = require('express');
const {
    createSubadmin,
    getAllSubadmins,
    getSubadminById,
    updateSubadmin,
    deleteSubadmin
} = require('../controllers/adminController');
const { authenticateToken, authorizeRole, authorizePermission } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole('admin'));

router.post('/subadmins', authorizePermission('canCreate'), createSubadmin);
router.get('/subadmins', authorizePermission('canRead'), getAllSubadmins);
router.get('/subadmins/:id', authorizePermission('canRead'), getSubadminById);
router.put('/subadmins/:id', authorizePermission('canUpdate'), updateSubadmin);
router.delete('/subadmins/:id', authorizePermission('canDelete'), deleteSubadmin);

module.exports = router;
