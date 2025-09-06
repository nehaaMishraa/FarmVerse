const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   GET /api/users/profile
// @desc    Get current user's profile (name, points, badges, tier)
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // We already have the user attached to the request from authMiddleware
    // We select only the fields we need for the profile display
    const userProfile = await User.findById(req.user.id).select('name points badges location tier tierProgress');
    
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Update tier based on current points
    const tierUpdate = userProfile.updateTier();
    await userProfile.save();
    
    res.json({
      ...userProfile.toObject(),
      tierUpdate
    });
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
