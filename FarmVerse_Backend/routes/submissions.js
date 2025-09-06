const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const authMiddleware = require('../middleware/authMiddleware');
const Submission = require('../models/Submission');
const Quest = require('../models/Quest');
const User = require('../models/User');

// --- Multer and Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage to handle the file as a buffer before uploading
const storage = multer.memoryStorage();

// Filter to ensure only image files are accepted
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({ message: 'Not an image! Please upload only images.' }, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

// --- API Endpoints ---

// @route   POST /api/submissions
// @desc    Submit proof for a quest
// @access  Private
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { questId } = req.body;

    // Check if a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image proof is required.' });
    }

    // Verify that the quest and user exist
    const quest = await Quest.findById(questId);
    const user = await User.findById(req.user.id);
    if (!quest || !user) {
      return res.status(404).json({ message: 'Quest or User not found.' });
    }

    // Upload the image to Cloudinary from the buffer
    const cloudinaryUpload = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'farmverse_submissions' }, // Optional: organize uploads into a folder
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const uploadResult = await cloudinaryUpload;

    // Create a new submission record in the database
    const newSubmission = new Submission({
      user: user._id,
      quest: quest._id,
      imageUrl: uploadResult.secure_url, // Save the secure URL from Cloudinary
      status: 'pending',
    });
    await newSubmission.save();

    // Award points to the user for the submission
    user.points += quest.points;
    await user.save();

    // Send a success response
    res.status(201).json({
      message: 'Submission successful!',
      submission: newSubmission,
    });
  } catch (err) {
    console.error('SERVER ERROR on submission:', err);
    res.status(500).json({ message: 'Server error during submission process.' });
  }
});

module.exports = router;

