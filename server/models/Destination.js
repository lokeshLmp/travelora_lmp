const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  country: { type: String, default: 'India' },
  category: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 100 },
  startingPrice: { type: Number, required: true },
  bestTimeToVisit: { type: String, default: '' },
  estimatedBudget: { type: String, default: '' },
  popularAttractions: [{ type: String }],
  thingsToDo: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', DestinationSchema);
