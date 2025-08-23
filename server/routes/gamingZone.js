const express = require('express');
const router = express.Router();
const {
  createGamingZone,
  getAllGamingZones,
  getAllGamingZonesPublic,
  getGamingZoneById,
  getGamingZoneByIdPublic,
  updateGamingZone,
  deleteGamingZone
} = require('../controllers/gamingZoneController');
const { authenticateToken } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/public', getAllGamingZonesPublic);
router.get('/public/:id', getGamingZoneByIdPublic);

// Protected routes (authentication required)
router.use(authenticateToken); // Apply authentication middleware to all routes below

router.post('/', createGamingZone);
router.get('/', getAllGamingZones);
router.get('/:id', getGamingZoneById);
router.put('/:id', updateGamingZone);
router.delete('/:id', deleteGamingZone);

module.exports = router;
