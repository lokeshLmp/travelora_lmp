const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  rating: { type: Number, required: true },
  destination: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString('en-IN') },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
