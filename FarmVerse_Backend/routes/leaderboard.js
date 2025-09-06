const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/leaderboard
// @desc    Get the top 10 users ranked by points
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Improvement: Only find users who have earned points (points > 0)
    const leaderboard = await User.find({ points: { $gt: 0 } })
      .sort({ points: -1 }) // -1 means sort in descending order
      .limit(10)
      .select('name points location.panchayat tier tierProgress'); // Select only the data we need to display

    // Improvement: Handle the case where no one is on the leaderboard yet
    if (!leaderboard || leaderboard.length === 0) {
      return res.json([]); // Return an empty array if no users have points
    }

    // Update tiers for all users in leaderboard to ensure accuracy
    const updatedLeaderboard = [];
    for (const user of leaderboard) {
      const tierUpdate = user.updateTier();
      await user.save();
      updatedLeaderboard.push({
        ...user.toObject(),
        tier: user.tier,
        tierProgress: user.tierProgress
      });
    }

    res.json(updatedLeaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

