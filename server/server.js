const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const errorHandler = require('./middleware/errorHandler');

// Load server/.env no matter which folder the server is started from.
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();

// If the React app has been built (client/dist), this server also serves it.
const clientDist = path.join(__dirname, '../client/dist');
const hasClientBuild = fs.existsSync(path.join(clientDist, 'index.html'));
if (!hasClientBuild) {
  app.get('/', (req, res) => {
    res.send('Travelora backend is running successfully!');
  });
}
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/travelora';

// Middleware
app.use(cors());
app.use(express.json());

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'TRAVELORA API',
    time: new Date().toISOString(),
    demoMode: mongoose.connection.readyState !== 1
  });
});

// Register Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
// Java Spring Boot booking service (proxied): /api/java/bookings, /api/java/health ...
app.use('/api/java', require('./routes/javaBookings'));

// Unknown API routes return JSON instead of the React page
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Serve the built React app and support client-side routes (React Router)
if (hasClientBuild) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error Handler Middleware
app.use(errorHandler);

// Connect to MongoDB with graceful fallback for academic demo
const startServer = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('[Travelora] ✓ Connected to MongoDB successfully.');
  } catch (err) {
    // Never print the connection string: it contains the database password.
    const reason = String((err && err.message) || err).replace(/mongodb(\+srv)?:\/\/\S+/gi, '[hidden connection string]');
    console.log('[Travelora] ℹ Could not connect to MongoDB (' + reason + '). Running in Academic Demo Mode with local datasets.');
    if (/[<>]/.test(process.env.MONGODB_URI || '')) {
      console.log('[Travelora] ⚠ MONGODB_URI still contains a placeholder such as <username>. Replace the whole placeholder, including < and >.');
    }
  }

  app.listen(PORT, () => {
    console.log(`[Travelora Server] Running at http://localhost:${PORT}`);
  });
};

startServer();
