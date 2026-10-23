const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true
  },
  seatClass: {
    type: String,
    enum: ['Economy', 'Premium', 'Business'],
    default: 'Economy'
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'SELECTED', 'BOOKED'],
    default: 'AVAILABLE'
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lockedAt: {
    type: Date,
    default: null
  }
});

const FlightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, 'Please provide flight number'],
    unique: true
  },
  airline: {
    type: String,
    required: [true, 'Please provide airline name']
  },
  from: {
    type: String,
    required: [true, 'Please provide departure location'],
    trim: true
  },
  to: {
    type: String,
    required: [true, 'Please provide arrival location'],
    trim: true
  },
  departureTime: {
    type: Date,
    required: [true, 'Please provide departure date & time']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Please provide arrival date & time']
  },
  duration: {
    type: String, // e.g. "2h 45m"
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Please specify standard base price']
  },
  seats: {
    type: [SeatSchema],
    default: []
  },
  co2Estimate: {
    type: Number, // Estimated CO2 in kg
    default: 150
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Flight', FlightSchema);
