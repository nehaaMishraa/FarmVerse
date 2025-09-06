const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Soil Health',
        'Water Management',
        'Bio-Pesticides',
        'Soil & Nutrient Management', // <-- Added
        'Pest Management',            // <-- Added
        'General',
      ],
    },
    points: {
      type: Number,
      required: true,
      default: 10,
    },
    // Optional: add criteria for personalization later
    // targetCrop: String,
    // targetLocation: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quest', QuestSchema);

