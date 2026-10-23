const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelora';
    console.log(`Attempting to connect to MongoDB: ${uri}`);
    
    // Short timeout (3 seconds) to detect if server is down quickly
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB Connected successfully.');
  } catch (err) {
    console.warn('Local MongoDB connection failed. Attempting to start in-memory MongoDB Server...');
    try {
      // Lazy load to allow optional run or handle dependency delays
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      console.log(`In-Memory MongoDB started at: ${mongoUri}`);
      
      await mongoose.connect(mongoUri);
      console.log('Connected to In-Memory MongoDB successfully.');
      
      // Save global reference for clean shutdown
      global.__MONGO_SERVER__ = mongoServer;
    } catch (memErr) {
      console.error('Failed to start In-Memory MongoDB Server:', memErr.message);
      console.error('Please check if local MongoDB is installed and running, or verify your connection settings.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
