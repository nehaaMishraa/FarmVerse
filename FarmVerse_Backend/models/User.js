const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Please fill a valid 10-digit mobile number'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    location: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      panchayat: { type: String, required: true },
    },
    farmSize: {
      type: Number, // in Acres
      required: true,
    },
    primaryCrops: {
      type: [String],
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze',
    },
    tierProgress: {
      current: { type: Number, default: 0 },
      next: { type: Number, default: 200 },
      percentage: { type: Number, default: 0 }
    },
    badges: {
      type: [String],
      default: [],
    },
    redeemedCoupons: [{
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
      },
      redeemedAt: {
        type: Date,
        default: Date.now,
      },
      discountCode: String,
    }],
  },
  { timestamps: true }
);

// This is the function that was missing.
// It compares the password the user enters with the hashed password in the database.
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to calculate and update tier based on points
UserSchema.methods.updateTier = function() {
  const points = this.points;
  let newTier = 'Bronze';
  let nextThreshold = 200;
  
  // Correct tier calculation based on your requirements
  if (points >= 1000) {
    newTier = 'Platinum';
    nextThreshold = null; // No next tier
  } else if (points >= 500) {
    newTier = 'Gold';
    nextThreshold = 1000;
  } else if (points >= 200) {
    newTier = 'Silver';
    nextThreshold = 500;
  } else {
    newTier = 'Bronze';
    nextThreshold = 200;
  }
  
  // Calculate progress to next tier
  let currentProgress = 0;
  let percentage = 0;
  
  if (nextThreshold) {
    const previousThreshold = newTier === 'Silver' ? 200 : 
                            newTier === 'Gold' ? 500 : 
                            newTier === 'Platinum' ? 1000 : 0;
    currentProgress = points - previousThreshold;
    const tierRange = nextThreshold - previousThreshold;
    percentage = Math.round((currentProgress / tierRange) * 100);
  } else {
    // Platinum tier - show 100% progress
    currentProgress = points - 1000;
    percentage = 100;
  }
  
  // Store the previous tier to check if it changed
  const previousTier = this.tier;
  
  this.tier = newTier;
  this.tierProgress = {
    current: currentProgress,
    next: nextThreshold,
    percentage: percentage
  };
  
  return {
    tier: newTier,
    tierProgress: this.tierProgress,
    isNewTier: previousTier !== newTier
  };
};

// This function runs automatically before a new user is saved.
// It hashes the plain-text password for security.
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);

