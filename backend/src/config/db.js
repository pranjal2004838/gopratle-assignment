const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gopratle_db';

  try {
    // short timeout so it doesn't hang if local mongodb isn't installed
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`>>> MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[WARN] MongoDB connection failed: ${error.message}`);
    console.log('>>> Running in local demo mode (in-memory fallback active). To use real MongoDB, provide MONGODB_URI in backend/.env');
  }
};

module.exports = connectDB;
