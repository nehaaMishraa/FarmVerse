const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quest: {
      type: Schema.Types.ObjectId,
      ref: 'Quest',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', SubmissionSchema);

