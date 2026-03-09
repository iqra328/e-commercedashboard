const mongoose = require('mongoose');

// Manual URI (direct use)
const MONGO_URI = 'mongodb+srv://iqrarehman:43YNgXYGtsjK6QSY@iqracluster.j0hggdo.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=iqraCluster';

async function testDirectConnection() {
  console.log('🔌 Testing Direct MongoDB Connection...');
  console.log('📡 URI:', MONGO_URI.replace(/:[^:@]*@/, ':****@'));
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    
    // Test database operations
    const db = mongoose.connection.db;
    console.log('📊 Database Name:', db.databaseName);
    
    // Try to create a test collection
    await db.createCollection('test_connection');
    console.log('✅ Test collection created');
    
    // Clean up
    await db.dropCollection('test_connection');
    console.log('✅ Test collection dropped');
    
    await mongoose.disconnect();
    console.log('👋 Disconnected');
    
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔐 Solution:');
      console.log('1. Username: "iqrarehman"');
      console.log('2. Password: "43YNgXYGtsjK6QSY"');
      console.log('3. MongoDB Atlas mein jaake check karein ke yeh user exists karta hai');
    }
    
    if (error.message.includes('whitelist')) {
      console.log('\n🔒 Solution:');
      console.log('1. MongoDB Atlas par jaayein');
      console.log('2. Network Access menu mein jaayein');
      console.log('3. "Add IP Address" click karein');
      console.log('4. "Allow Access from Anywhere" select karein');
      console.log('5. Ya apni current IP address add karein');
    }
  }
}

testDirectConnection();