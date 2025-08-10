// Integration test for frontend-backend communication
// Run with: node test-integration.js

const API_BASE = 'http://localhost:3001/api';

async function testIntegration() {
  console.log('🧪 Testing Frontend-Backend Integration...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing backend health...');
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend health:', healthData.message);

    // Test 2: Create a test item
    console.log('\n2. Testing item creation...');
    const testItem = {
      type: 'lost',
      name: 'Integration Test Item',
      description: 'This is a test item created during integration testing',
      location: 'Test Location',
      latitude: 40.7128,
      longitude: -74.0060,
      image_url: 'https://example.com/test-image.jpg',
      contact_info: 'test@integration.com'
    };

    const createResponse = await fetch(`${API_BASE}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testItem)
    });

    const createData = await createResponse.json();
    
    if (createData.success) {
      console.log('✅ Item created successfully');
      console.log('   Item ID:', createData.data.id);
      
      // Test 3: Get the created item
      console.log('\n3. Testing item retrieval...');
      const getResponse = await fetch(`${API_BASE}/items/${createData.data.id}`);
      const getData = await getResponse.json();
      console.log('✅ Item retrieved:', getData.data.name);

      // Test 4: Delete the test item
      console.log('\n4. Testing item deletion...');
      const deleteResponse = await fetch(`${API_BASE}/items/${createData.data.id}`, {
        method: 'DELETE'
      });
      const deleteData = await deleteResponse.json();
      console.log('✅ Item deleted:', deleteData.message);

    } else {
      console.log('❌ Item creation failed:', createData.message);
    }

    // Test 5: Check frontend is accessible
    console.log('\n5. Testing frontend accessibility...');
    try {
      const frontendResponse = await fetch('http://localhost:5173');
      if (frontendResponse.ok) {
        console.log('✅ Frontend is accessible');
      } else {
        console.log('⚠️  Frontend returned status:', frontendResponse.status);
      }
    } catch (error) {
      console.log('⚠️  Frontend not accessible (may not be running):', error.message);
    }

    console.log('\n🎉 Integration test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Open http://localhost:5173 in your browser');
    console.log('2. Try creating a lost or found item');
    console.log('3. Check that items appear in the listings');
    console.log('4. Test image upload functionality');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure backend is running: node backend/server.js');
    console.log('2. Make sure frontend is running: npm run dev');
    console.log('3. Check that both servers are on the correct ports');
  }
}

// Run the test
testIntegration();
