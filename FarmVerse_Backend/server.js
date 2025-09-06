// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully!');
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

// --- API Routes ---
app.get('/', (req, res) => res.send('FarmVerse API is running...'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quests', require('./routes/quests'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/advisor', require('./routes/advisor'));
app.use('/api/users', require('./routes/users'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

// THIS IS THE NEW LINE THAT FIXES THE 404 ERROR
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/forum', require('./routes/forum'));


// --- Server Startup ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

