const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['destination', 'flight', 'hotel', 'package'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only wishlist a specific item once
WishlistSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
