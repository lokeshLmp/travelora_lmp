const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  destination: { type: String, required: true },
  country: { type: String, default: 'India' },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 100 },
  category: { type: String, required: true },
  travelType: { type: String, default: 'Holiday' },
  image: { type: String, required: true },
  includes: [{ type: String }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  accommodation: { type: String, default: '4-Star Resort' },
  meals: { type: String, default: 'Daily Breakfast' },
  transport: { type: String, default: 'Private Cab' },
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String]
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Package', PackageSchema);
