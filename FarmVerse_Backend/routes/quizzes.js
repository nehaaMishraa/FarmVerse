const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @route   GET /api/quizzes
// @desc    Get all available quizzes (summary view for the dashboard)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Select only the fields needed for the list on the dashboard
    const quizzes = await Quiz.find().select('title category points');
    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get a single, full quiz by its ID to start it
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (err) {
        console.error('Error fetching single quiz:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});


// @route   POST /api/quizzes/submit
// @desc    Submit answers for a quiz, get a score, and award points
// @access  Private
router.post('/submit', authMiddleware, async (req, res) => {
  const { quizId, answers } = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    // Calculate the user's score by comparing their answers to the correct ones
    quiz.questions.forEach((question, index) => {
      if (answers[index] && answers[index] === question.correctAnswer) {
        score++;
      }
    });

    // Award points only if the user gets more than half the questions right
    const pointsAwarded = score > quiz.questions.length / 2 ? quiz.points : 0;

    if (pointsAwarded > 0) {
      // Find the user and add the points to their total score
      await User.findByIdAndUpdate(req.user.id, { $inc: { points: pointsAwarded } });
    }

    // Send the results back to the frontend to be displayed
    res.json({
      score,
      totalQuestions: quiz.questions.length,
      pointsAwarded,
      message: pointsAwarded > 0 
        ? `Great job! You earned ${pointsAwarded} points.` 
        : "Good try! Review the topics and try another quiz."
    });

  } catch (err) {
    console.error('Error submitting quiz:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

