const express = require('express');
const router = express.Router();
const messController = require('../controllers/messController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no auth required)
router.get('/public', messController.getAllMesses);
router.get('/public/:id', messController.getMessById);

// Protected routes (require authentication)
router.use(authenticateToken); // Apply auth middleware to all routes below

// CRUD operations
router.post('/', messController.createMess);
router.get('/', messController.getAllMesses);
router.get('/:id', messController.getMessById);
router.put('/:id', messController.updateMess);
router.delete('/:id', messController.deleteMess);

module.exports = router;
