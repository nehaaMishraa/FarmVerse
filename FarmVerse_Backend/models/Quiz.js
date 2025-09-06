const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for an individual question
const QuestionSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  }
});

// Schema for the overall quiz
const QuizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    questions: [QuestionSchema], // An array of question objects
    points: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', QuizSchema);

