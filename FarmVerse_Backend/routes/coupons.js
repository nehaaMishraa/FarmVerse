const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Coupon = require('../models/Coupon');
const User = require('../models/User');

// @route   GET /api/coupons
// @desc    Get all available coupons for a logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('points redeemedCoupons');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get all active coupons
    const coupons = await Coupon.find({ 
      isActive: true,
      $or: [
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ]
    }).sort({ pointsRequired: 1 });

    // Update user tier before processing coupons
    const tierUpdate = user.updateTier();
    await user.save();

    // Add user-specific information to each coupon
    const couponsWithUserInfo = coupons.map(coupon => {
      const isRedeemed = user.redeemedCoupons.some(
        redeemed => redeemed.couponId.toString() === coupon._id.toString()
      );
      const canRedeem = user.points >= coupon.pointsRequired && !isRedeemed;
      
      return {
        ...coupon.toObject(),
        isRedeemed,
        canRedeem,
        userPoints: user.points,
        userTier: user.tier
      };
    });

    res.json(couponsWithUserInfo);
  } catch (err) {
    console.error('Error fetching coupons:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/coupons/:couponId/redeem
// @desc    Redeem a coupon
// @access  Private
router.post('/:couponId/redeem', authMiddleware, async (req, res) => {
  try {
    const { couponId } = req.params;
    const userId = req.user.id;

    // Find the coupon
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: 'This coupon is no longer active.' });
    }

    // Check if coupon has expired
    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired.' });
    }

    // Check if coupon has reached max redemptions
    if (coupon.maxRedemptions && coupon.currentRedemptions >= coupon.maxRedemptions) {
      return res.status(400).json({ message: 'This coupon is no longer available.' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user has enough points
    if (user.points < coupon.pointsRequired) {
      return res.status(400).json({ 
        message: 'Insufficient points to redeem this coupon.',
        required: coupon.pointsRequired,
        available: user.points
      });
    }

    // Check if user has already redeemed this coupon
    const alreadyRedeemed = user.redeemedCoupons.some(
      redeemed => redeemed.couponId.toString() === couponId
    );

    if (alreadyRedeemed) {
      return res.status(400).json({ message: 'You have already redeemed this coupon.' });
    }

    // Redeem the coupon
    user.redeemedCoupons.push({
      couponId: coupon._id,
      discountCode: coupon.discountCode
    });

    // Deduct points
    user.points -= coupon.pointsRequired;

    // Update coupon redemption count
    coupon.currentRedemptions += 1;

    // Save both user and coupon
    await Promise.all([user.save(), coupon.save()]);

    res.json({
      message: 'Coupon redeemed successfully!',
      coupon: {
        title: coupon.title,
        discountCode: coupon.discountCode,
        description: coupon.description
      },
      remainingPoints: user.points
    });

  } catch (err) {
    console.error('Error redeeming coupon:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/coupons/my-coupons
// @desc    Get user's redeemed coupons
// @access  Private
router.get('/my-coupons', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('redeemedCoupons.couponId', 'title description sponsor discountCode')
      .select('redeemedCoupons');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user.redeemedCoupons);
  } catch (err) {
    console.error('Error fetching user coupons:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/coupons/seed
// @desc    Seed the database with initial coupons (for development)
// @access  Public (should be protected in production)
router.post('/seed', async (req, res) => {
  try {
    // Check if coupons already exist
    const existingCoupons = await Coupon.countDocuments();
    if (existingCoupons > 0) {
      return res.json({ 
        message: 'Coupons already exist in database.',
        count: existingCoupons,
        action: 'skipped'
      });
    }

    const initialCoupons = [
      {
        title: "Featured Farmer of the Month",
        description: "Be featured on the main dashboard and leaderboard for an entire month! Your success story will be shared with the community.",
        sponsor: "FarmVerse Platform",
        pointsRequired: 1500,
        discountCode: "COMMUNITY-STAR-2025",
        category: "recognition"
      },
      {
        title: "Advanced Drip Irrigation Masterclass",
        description: "Get a free pass to an exclusive online masterclass on advanced techniques for water saving and fertigation with drip systems.",
        sponsor: "Krishi Vigyan Kendra (KVK)",
        pointsRequired: 2000,
        discountCode: "WATER-GURU-PASS",
        category: "education"
      },
      {
        title: "₹2500 Off Solar Pump",
        description: "Receive a massive discount of ₹2500 on the installation of a new solar-powered water pump for your farm.",
        sponsor: "Rajasthan Renewable Energy Corp.",
        pointsRequired: 5000,
        discountCode: "SOLAR-POWER-2500",
        category: "equipment"
      },
      {
        title: "30-Minute Expert Consultation",
        description: "Schedule a private 30-minute video call with an agricultural scientist to discuss your specific crop or soil issues.",
        sponsor: "AgriTech Innovators",
        pointsRequired: 2500,
        discountCode: "EXPERT-CONNECT-30",
        category: "consultation"
      },
      {
        title: "Premium Soil Health Analysis Kit",
        description: "Receive a premium soil testing kit by mail, which includes tests for micronutrients and organic carbon levels. Includes a free analysis report.",
        sponsor: "FarmVerse Labs",
        pointsRequired: 1800,
        discountCode: "SOIL-HEALTH-PRO",
        category: "analysis"
      }
    ];

    const createdCoupons = await Coupon.insertMany(initialCoupons);
    res.status(201).json({ 
      message: 'Coupons seeded successfully!',
      count: createdCoupons.length,
      action: 'created',
      coupons: createdCoupons.map(c => ({
        title: c.title,
        pointsRequired: c.pointsRequired,
        category: c.category
      }))
    });

  } catch (err) {
    console.error('Error seeding coupons:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
