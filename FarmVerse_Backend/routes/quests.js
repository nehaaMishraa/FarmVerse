const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/quests
// @desc    Get all available quests for a logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const quests = await Quest.find({});
    res.json(quests);
  } catch (error) {
    console.error('Error fetching quests:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/quests
// @desc    Create a new quest (for admin/testing purposes)
// @access  Public (can be changed to private for admin-only access)
router.post('/', async (req, res) => {
  const { title, description, category, points } = req.body;
  try {
    const newQuest = new Quest({
      title,
      description,
      category,
      points,
    });

    const savedQuest = await newQuest.save();
    res.status(201).json(savedQuest);
  } catch (error) {
    console.error('Error creating quest:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

