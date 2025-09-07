const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

async function testAPI() {
  console.log('🧪 Testing E-Commerce API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data.message);

    // Test 2: Signup
    console.log('\n2. Testing user signup...');
    try {
      const signupResponse = await axios.post(`${BASE_URL}/auth/signup`, testUser);
      authToken = signupResponse.data.token;
      console.log('✅ Signup successful:', signupResponse.data.message);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️  User already exists, testing login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        authToken = loginResponse.data.token;
        console.log('✅ Login successful:', loginResponse.data.message);
      } else {
        throw error;
      }
    }

    // Test 3: Get items
    console.log('\n3. Testing get items...');
    const itemsResponse = await axios.get(`${BASE_URL}/items`);
    console.log(`✅ Retrieved ${itemsResponse.data.count} items`);

    // Test 4: Get categories
    console.log('\n4. Testing get categories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/items/categories/list`);
    console.log('✅ Categories:', categoriesResponse.data);

    // Test 5: Add to cart
    console.log('\n5. Testing add to cart...');
    if (itemsResponse.data.items.length > 0) {
      const firstItem = itemsResponse.data.items[0];
      const cartResponse = await axios.post(`${BASE_URL}/cart/add`, {
        itemId: firstItem._id,
        quantity: 2
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Added to cart:', cartResponse.data.items.length, 'items');

      // Test 6: Get cart
      console.log('\n6. Testing get cart...');
      const getCartResponse = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Cart retrieved:', getCartResponse.data.items.length, 'items, Total: $' + getCartResponse.data.total);

      // Test 7: Update cart
      console.log('\n7. Testing update cart...');
      const updateCartResponse = await axios.put(`${BASE_URL}/cart/update`, {
        itemId: firstItem._id,
        quantity: 3
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Cart updated:', updateCartResponse.data.items.length, 'items');

      // Test 8: Remove from cart
      console.log('\n8. Testing remove from cart...');
      const removeCartResponse = await axios.delete(`${BASE_URL}/cart/remove`, {
        data: { itemId: firstItem._id },
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Item removed from cart:', removeCartResponse.data.items.length, 'items remaining');
    }

    // Test 9: Filter items
    console.log('\n9. Testing item filtering...');
    const filterResponse = await axios.get(`${BASE_URL}/items?category=electronics&minPrice=100&maxPrice=2000`);
    console.log(`✅ Filtered items: ${filterResponse.data.count} electronics between $100-$2000`);

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📋 API is ready for frontend integration.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Backend server is running (npm run dev)');
    console.log('2. MongoDB is running');
    console.log('3. Database is seeded (node seed.js)');
  }
}

testAPI();

