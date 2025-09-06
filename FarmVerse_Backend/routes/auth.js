const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Function to generate a JSON Web Token for authentication
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token will be valid for 30 days
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, mobileNumber, password, location, farmSize, primaryCrops } = req.body;
  try {
    // Check if a user with the same mobile number already exists
    const userExists = await User.findOne({ mobileNumber });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user instance
    const user = await User.create({
      name,
      mobileNumber,
      password,
      location,
      farmSize,
      primaryCrops,
    });

    // If user created successfully, send back user info and token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { mobileNumber, password } = req.body;
  try {
    // Find user by mobile number
    const user = await User.findOne({ mobileNumber });

    // Check if user exists and if the password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        token: generateToken(user._id),
      });
    } else {
      // Send a generic error message for security
      res.status(401).json({ message: 'Invalid mobile number or password' });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;

