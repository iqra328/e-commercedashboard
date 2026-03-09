const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log('🔌 Testing MongoDB Atlas Connection...');
  console.log('=====================================');
  
  const uri = process.env.MONGO_URI;
  console.log('📡 Using URI (password hidden):', uri.replace(/:[^:@]*@/, ':****@'));
  
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    family: 4,
  };
  
  try {
    console.log('\n⏳ Connecting...');
    await mongoose.connect(uri, options);
    
    console.log('✅ CONNECTED SUCCESSFULLY!\n');
    
    // Get connection info
    const db = mongoose.connection.db;
    console.log('📊 Database Name:', db.databaseName);
    
    // Try to create a test collection
    await db.createCollection('test_connection');
    console.log('✅ Test collection created');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name).join(', '));
    
    // Clean up
    await db.dropCollection('test_connection');
    console.log('✅ Test collection cleaned up\n');
    
    console.log('🎉 All tests passed! Your connection is working perfectly.');
    
    await mongoose.disconnect();
    console.log('👋 Disconnected');
    
  } catch (error) {
    console.error('\n❌ CONNECTION FAILED!');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔐 FIX:');
      console.log('1. Check username: "iqrarehman"');
      console.log('2. Check password: "43YNgXYGtsjK6QSY"');
      console.log('3. Make sure password has no special characters');
    }
    
    if (error.message.includes('timed out')) {
      console.log('\n⏱️ FIX:');
      console.log('1. Disable Windows Firewall temporarily');
      console.log('2. Disable antivirus');
      console.log('3. Check if port 27017 is blocked');
      console.log('4. Try mobile hotspot');
    }
    
    if (error.message.includes('getaddrinfo')) {
      console.log('\n🌐 FIX:');
      console.log('1. Use Google DNS (8.8.8.8)');
      console.log('2. Flush DNS: ipconfig /flushdns');
      console.log('3. Check hosts file');
    }
  }
}

testConnection();