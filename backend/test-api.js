// Simple API test script
// Run with: node test-api.js

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing Lost & Found API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test get items (should be empty initially)
    console.log('\n2. Testing get items endpoint...');
    const itemsResponse = await fetch(`${API_BASE}/items`);
    const itemsData = await itemsResponse.json();
    console.log('✅ Get items:', `Found ${itemsData.data?.length || 0} items`);

    // Test create item
    console.log('\n3. Testing create item endpoint...');
    const testItem = {
      type: 'lost',
      name: 'Test iPhone',
      description: 'Black iPhone 13 with red case',
      location: 'Central Park, New York',
      latitude: 40.7829,
      longitude: -73.9654,
      image_url: 'https://example.com/test-image.jpg',
      contact_info: 'test@example.com'
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
      console.log('✅ Create item:', createData.message);
      console.log('   Item ID:', createData.data.id);
      
      // Test get specific item
      console.log('\n4. Testing get specific item endpoint...');
      const itemResponse = await fetch(`${API_BASE}/items/${createData.data.id}`);
      const itemData = await itemResponse.json();
      console.log('✅ Get specific item:', itemData.data.name);

      // Test update item
      console.log('\n5. Testing update item endpoint...');
      const updateResponse = await fetch(`${API_BASE}/items/${createData.data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'Updated description for test iPhone'
        })
      });

      const updateData = await updateResponse.json();
      console.log('✅ Update item:', updateData.message);

      // Test delete item
      console.log('\n6. Testing delete item endpoint...');
      const deleteResponse = await fetch(`${API_BASE}/items/${createData.data.id}`, {
        method: 'DELETE'
      });

      const deleteData = await deleteResponse.json();
      console.log('✅ Delete item:', deleteData.message);

    } else {
      console.log('❌ Create item failed:', createData.message);
    }

    // Test filters
    console.log('\n7. Testing filters...');
    const filterResponse = await fetch(`${API_BASE}/items?type=lost&limit=5`);
    const filterData = await filterResponse.json();
    console.log('✅ Filter items:', `Found ${filterData.data?.length || 0} lost items`);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the server is running on http://localhost:3001');
  }
}

// Run tests
testAPI();
