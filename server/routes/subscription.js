const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscriptionStatus,
  getAllSubscriptions,
  updatePreferences
} = require('../controllers/subscriptionController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/status', getSubscriptionStatus);
router.put('/preferences', updatePreferences);

// Admin only routes
router.get('/all', authenticateToken, authorizeRole('admin'), getAllSubscriptions);

module.exports = router;
