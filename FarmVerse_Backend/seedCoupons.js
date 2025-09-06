const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coupon = require('./models/Coupon');

// Load environment variables
dotenv.config();

const seedCoupons = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if coupons already exist
    const existingCoupons = await Coupon.countDocuments();
    if (existingCoupons > 0) {
      console.log('Coupons already exist in database. Skipping seed.');
      process.exit(0);
    }

    // Initial coupons data
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

    // Insert coupons
    const createdCoupons = await Coupon.insertMany(initialCoupons);
    console.log(`Successfully seeded ${createdCoupons.length} coupons!`);
    
    // Display the created coupons
    createdCoupons.forEach(coupon => {
      console.log(`- ${coupon.title} (${coupon.pointsRequired} points)`);
    });

  } catch (error) {
    console.error('Error seeding coupons:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedCoupons();
