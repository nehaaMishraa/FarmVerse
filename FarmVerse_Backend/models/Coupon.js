const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    sponsor: {
      type: String,
      required: true,
    },
    pointsRequired: {
      type: Number,
      required: true,
      min: 0,
    },
    discountCode: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['education', 'equipment', 'consultation', 'recognition', 'analysis'],
      required: true,
    },
    expiryDate: {
      type: Date,
      default: null, // null means no expiry
    },
    maxRedemptions: {
      type: Number,
      default: null, // null means unlimited
    },
    currentRedemptions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
CouponSchema.index({ pointsRequired: 1, isActive: 1 });

module.exports = mongoose.model('Coupon', CouponSchema);
