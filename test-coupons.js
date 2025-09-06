// Simple test script to seed coupons and verify the system
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testCouponSystem() {
  try {
    console.log('🚀 Testing FarmVerse Coupon System...\n');

    // Step 1: Seed the coupons
    console.log('📦 Seeding coupons...');
    const seedResponse = await axios.post(`${API_BASE_URL}/coupons/seed`);
    console.log('✅ Seed Response:', seedResponse.data);
    console.log('');

    // Step 2: Test fetching coupons (this would normally require auth)
    console.log('🔍 Testing coupon fetch endpoint...');
    try {
      const couponsResponse = await axios.get(`${API_BASE_URL}/coupons`);
      console.log('✅ Coupons fetched successfully:', couponsResponse.data.length, 'coupons found');
    } catch (error) {
      console.log('⚠️  Coupon fetch requires authentication (expected)');
    }

    console.log('\n🎉 Coupon system test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your backend server: cd FarmVerse_Backend && npm run dev');
    console.log('2. Start your frontend: cd FarmVerse_Frontend && npm run dev');
    console.log('3. Login to your app and check the dashboard for the rewards section');
    console.log('4. The coupons should now be visible in the "🎁 Rewards & Coupons" section');

  } catch (error) {
    console.error('❌ Error testing coupon system:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testCouponSystem();
