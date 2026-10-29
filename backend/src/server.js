const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const requirementRoutes = require('./routes/requirementRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors()); // allow cross origin requests
app.use(express.json()); // parse incoming json bodies

// Health check endpoints (both with and without /api prefix)
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    service: 'GoPratle Requirement Service'
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Main routes (mount both with and without /api so any frontend env format works)
app.use('/api/requirements', requirementRoutes);
app.use('/requirements', requirementRoutes);

// Simple catch-all 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
