# FarmVerse Coupon & Rewards System

## Overview
The FarmVerse platform now includes a comprehensive coupon and rewards system that allows farmers to earn points through quests and quizzes, and redeem them for valuable rewards and discounts from various sponsors.

## Features

### 🎁 Reward Categories
- **Education**: Masterclasses and learning opportunities
- **Equipment**: Discounts on farming equipment and tools
- **Consultation**: Expert advice and one-on-one sessions
- **Recognition**: Community features and achievements
- **Analysis**: Soil testing and analysis services

### 💰 Point System
- Farmers earn points by completing quests and quizzes
- Points are automatically tracked in the user profile
- Points can be redeemed for various rewards
- Points are deducted when coupons are redeemed

### 🎫 Coupon Management
- **Available Coupons**: View all redeemable coupons based on current points
- **My Coupons**: Track all redeemed coupons with discount codes
- **Real-time Updates**: Points and coupon availability update instantly
- **Copy to Clipboard**: Easy discount code copying functionality

## Backend Implementation

### Models

#### Coupon Model (`models/Coupon.js`)
```javascript
{
  title: String,           // Coupon title
  description: String,     // Detailed description
  sponsor: String,         // Sponsoring organization
  pointsRequired: Number,  // Points needed to redeem
  discountCode: String,    // Unique discount code
  isActive: Boolean,       // Whether coupon is available
  category: String,        // Category (education, equipment, etc.)
  expiryDate: Date,        // Optional expiry date
  maxRedemptions: Number,  // Optional redemption limit
  currentRedemptions: Number // Current redemption count
}
```

#### Updated User Model
Added `redeemedCoupons` array to track user's redeemed coupons:
```javascript
redeemedCoupons: [{
  couponId: ObjectId,      // Reference to Coupon
  redeemedAt: Date,        // Redemption timestamp
  discountCode: String     // Discount code for easy access
}]
```

### API Endpoints

#### GET `/api/coupons`
- Fetches all available coupons for the authenticated user
- Includes user-specific information (can redeem, is redeemed, user points)
- Returns coupons sorted by points required

#### POST `/api/coupons/:couponId/redeem`
- Redeems a specific coupon
- Validates user has sufficient points
- Prevents duplicate redemptions
- Updates user points and coupon redemption count

#### GET `/api/coupons/my-coupons`
- Fetches user's redeemed coupons
- Includes full coupon details and redemption information

#### POST `/api/coupons/seed` (Development)
- Seeds the database with initial coupon data
- Only runs if no coupons exist in database

## Frontend Implementation

### Components

#### CouponCard (`components/CouponCard.jsx`)
- Displays individual coupon information
- Shows redemption status and availability
- Handles redemption button states
- Category-based styling and icons

#### CouponSection (`components/CouponSection.jsx`)
- Main component for displaying available coupons
- Handles coupon fetching and redemption
- Shows user's current points
- Includes refresh functionality

#### MyCoupons (`components/MyCoupons.jsx`)
- Displays user's redeemed coupons
- Copy-to-clipboard functionality for discount codes
- Shows redemption dates and sponsor information

### Pages

#### Dashboard Integration
- Coupon section added to main dashboard
- Positioned prominently after the progress tracker
- Real-time point updates

#### My Coupons Page (`pages/MyCouponsPage.jsx`)
- Dedicated page for viewing redeemed coupons
- Accessible via navigation menu
- Clean, organized display of all redeemed rewards

## Setup Instructions

### 1. Backend Setup
```bash
cd FarmVerse_Backend
npm install
```

### 2. Seed Initial Coupons
```bash
npm run seed:coupons
```

This will add the following initial coupons:
- **Featured Farmer of the Month** (1500 points) - Recognition
- **Advanced Drip Irrigation Masterclass** (2000 points) - Education
- **₹2500 Off Solar Pump** (5000 points) - Equipment
- **30-Minute Expert Consultation** (2500 points) - Consultation
- **Premium Soil Health Analysis Kit** (1800 points) - Analysis

### 3. Frontend Setup
```bash
cd FarmVerse_Frontend
npm install
npm run dev
```

## Usage

### For Farmers
1. **Earn Points**: Complete quests and quizzes to earn points
2. **Browse Rewards**: View available coupons on the dashboard
3. **Redeem Coupons**: Click "Redeem Now" on coupons you can afford
4. **Track Redemptions**: Visit "My Coupons" to see all redeemed rewards
5. **Use Discount Codes**: Copy discount codes for use with sponsors

### For Administrators
1. **Add New Coupons**: Use the `/api/coupons` POST endpoint
2. **Manage Coupons**: Update coupon status, expiry dates, etc.
3. **Monitor Redemptions**: Track redemption counts and user engagement
4. **Seed Database**: Use the seed script to add initial coupons

## Security Features

- **Authentication Required**: All coupon endpoints require valid JWT tokens
- **Point Validation**: Server-side validation ensures users have sufficient points
- **Duplicate Prevention**: Users cannot redeem the same coupon twice
- **Expiry Handling**: Expired coupons are automatically filtered out
- **Redemption Limits**: Support for limited-availability coupons

## Future Enhancements

- **Email Notifications**: Notify users when new coupons are available
- **Push Notifications**: Real-time updates for mobile users
- **Coupon Categories**: Advanced filtering and search
- **Bulk Redemption**: Allow multiple coupon redemptions at once
- **Analytics Dashboard**: Track coupon performance and user engagement
- **Dynamic Pricing**: Adjust point requirements based on demand
- **Referral Rewards**: Bonus points for referring other farmers

## Technical Notes

- All API responses include proper error handling
- Frontend components are fully responsive
- Database queries are optimized with proper indexing
- Real-time updates without page refresh
- Clean separation of concerns between frontend and backend

## Support

For technical support or questions about the coupon system, please refer to the main FarmVerse documentation or contact the development team.
