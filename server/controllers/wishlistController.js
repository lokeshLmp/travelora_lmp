const Wishlist = require('../models/Wishlist');
const Destination = require('../models/Destination');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const Package = require('../models/Package');

/**
 * @desc    Get current user's wishlist items
 * @route   GET /api/wishlist
 * @access  Private
 */
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user.id });

    // Populate manually because of multi-model references
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        let details = null;
        if (item.itemType === 'destination') {
          details = await Destination.findById(item.itemId);
        } else if (item.itemType === 'flight') {
          details = await Flight.findById(item.itemId);
        } else if (item.itemType === 'hotel') {
          details = await Hotel.findById(item.itemId);
        } else if (item.itemType === 'package') {
          details = await Package.findById(item.itemId);
        }
        return {
          _id: item._id,
          itemType: item.itemType,
          itemId: item.itemId,
          details
        };
      })
    );

    // Filter out null/deleted references
    const activeItems = populatedItems.filter(item => item.details !== null);

    res.status(200).json({ success: true, count: activeItems.length, data: activeItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
exports.addToWishlist = async (req, res) => {
  try {
    const { itemType, itemId } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({ success: false, message: 'Please provide itemType and itemId' });
    }

    // Check if duplicate
    const existing = await Wishlist.findOne({ user: req.user.id, itemType, itemId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Item already in wishlist' });
    }

    const item = await Wishlist.create({
      user: req.user.id,
      itemType,
      itemId
    });

    res.status(201).json({ success: true, message: 'Added to wishlist', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/:id
 * @access  Private
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    // Delete either by wishlist record ID or by matching user and itemId
    let item = await Wishlist.findById(req.params.id);
    if (!item) {
      // Try mapping by itemId
      item = await Wishlist.findOne({ user: req.user.id, itemId: req.params.id });
    }

    if (!item) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    }

    // Check ownership
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await item.deleteOne();

    res.status(200).json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
