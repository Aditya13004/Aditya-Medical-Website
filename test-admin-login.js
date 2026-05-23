// Test Admin Login API
const fetch = require('node-fetch');

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login API...\n');
  
  try {
    // Test 1: Valid password
    console.log('Test 1: Valid password "admin@123"');
    const response1 = await fetch('http://localhost:3000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'admin@123' })
    });
    
    const data1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(data1, null, 2));
    
    if (data1.success && data1.token) {
      console.log('✅ Test 1 PASSED\n');
      
      // Test 2: Verify the token
      console.log('Test 2: Verify token');
      const response2 = await fetch('http://localhost:3000/api/auth/admin/verify', {
        headers: { 'Authorization': `Bearer ${data1.token}` }
      });
      
      const data2 = await response2.json();
      console.log('Status:', response2.status);
      console.log('Response:', JSON.stringify(data2, null, 2));
      
      if (data2.success) {
        console.log('✅ Test 2 PASSED\n');
      } else {
        console.log('❌ Test 2 FAILED\n');
      }
    } else {
      console.log('❌ Test 1 FAILED\n');
    }
    
    // Test 3: Invalid password
    console.log('Test 3: Invalid password "wrong"');
    const response3 = await fetch('http://localhost:3000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong' })
    });
    
    const data3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Response:', JSON.stringify(data3, null, 2));
    
    if (!data3.success && response3.status === 401) {
      console.log('✅ Test 3 PASSED\n');
    } else {
      console.log('❌ Test 3 FAILED\n');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testAdminLogin();
