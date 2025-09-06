const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const updateAllUserTiers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    let updatedCount = 0;
    let tierChanges = [];

    for (const user of users) {
      const oldTier = user.tier;
      const tierUpdate = user.updateTier();
      
      if (tierUpdate.isNewTier || oldTier !== user.tier) {
        tierChanges.push({
          name: user.name,
          points: user.points,
          oldTier: oldTier,
          newTier: user.tier
        });
      }
      
      await user.save();
      updatedCount++;
    }

    console.log(`\n✅ Updated tiers for ${updatedCount} users`);
    
    if (tierChanges.length > 0) {
      console.log('\n📊 Tier Changes:');
      tierChanges.forEach(change => {
        console.log(`- ${change.name}: ${change.points} points (${change.oldTier} → ${change.newTier})`);
      });
    } else {
      console.log('No tier changes needed - all users already have correct tiers');
    }

    // Show current leaderboard
    console.log('\n🏆 Current Leaderboard:');
    const leaderboard = await User.find({ points: { $gt: 0 } })
      .sort({ points: -1 })
      .limit(5)
      .select('name points tier');
    
    leaderboard.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - ${user.points} points (${user.tier})`);
    });

  } catch (error) {
    console.error('Error updating tiers:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
};

// Run the update function
updateAllUserTiers();
