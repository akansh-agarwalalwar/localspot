const express = require('express');
const router = express.Router();
const User = require('../models/User');

// NOTE: UI/UX enhancements are implemented client-side. This setup route unchanged in behavior.

// POST /api/setup/admin
// Body: { username, email, password, secret }
router.post('/admin', async (req, res) => {
  try {
    const { username, email, password, secret } = req.body;

    if (!secret || secret !== (process.env.ADMIN_SETUP_SECRET || '')) {
      return res.status(401).json({ message: 'Invalid setup secret' });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, password required' });
    }

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(409).json({ message: 'An admin already exists. Creation blocked.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const admin = new User({
      username,
      email,
      password,
      role: 'admin'
    });
    await admin.save();

    return res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt
      }
    });
  } catch (err) {
    console.error('Create admin error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/setup/admin/status
// Returns whether an admin exists (no sensitive data)
router.get('/admin/status', async (_req, res) => {
  try {
    const exists = await User.exists({ role: 'admin' });
    return res.json({ adminExists: !!exists });
  } catch (err) {
    console.error('Admin status error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
