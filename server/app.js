const express = require('express');
const cors = require('cors');
const path = require('path');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../client')));

// Mount API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/admin', require('./routes/admin'));

// AI & Insights endpoints mounted matching the required paths
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);                 // /api/ai/plan-trip
app.use('/api/recommendations', aiRoutes);    // /api/recommendations
app.use('/api/prices/insight', aiRoutes);     // /api/prices/insight/:itemId
app.use('/api/sustainability', aiRoutes);     // /api/sustainability/:bookingId

// Fallback to index.html for single page client navigation if requested
app.get('*', (req, res, next) => {
  // If it is an API request, let it fall through to 404
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Centralized error handler
app.use(errorMiddleware);

module.exports = app;
