const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  destination: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 100 },
  pricePerNight: { type: Number, required: true },
  image: { type: String, required: true },
  amenities: [{ type: String }],
  description: { type: String, default: '' },
  roomTypes: [{
    name: String,
    price: Number,
    capacity: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', HotelSchema);
