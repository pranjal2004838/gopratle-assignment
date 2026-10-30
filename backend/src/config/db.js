const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gopratle_db'

  try {
    // added serverSelectionTimeoutMS so it fails fast if mongo isn't running locally
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    })
    console.log('MongoDB connected:', conn.connection.host)
  } catch (err) {
    // not throwing here intentionally — app can still run with in-memory fallback
    console.warn('Could not connect to MongoDB:', err.message)
    console.log('Running in demo mode (in-memory). Set MONGODB_URI in .env to use real database.')
  }
}

module.exports = connectDB
