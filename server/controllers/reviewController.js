const Review = require('../models/Review');
const demoData = require('../data/demoData.json');

exports.getReviews = async (req, res) => {
  try {
    try {
      const reviews = await Review.find().sort({ createdAt: -1 });
      if (reviews && reviews.length > 0) {
        return res.json({ success: true, data: reviews });
      }
    } catch (err) {}

    return res.json({ success: true, data: demoData.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { name, rating, destination, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Name, rating, and review comment are required' });
    }

    const reviewData = {
      name,
      rating: Number(rating),
      destination: destination || 'General Trip',
      comment,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    try {
      const created = await Review.create(reviewData);
      return res.status(201).json({ success: true, data: created });
    } catch (dbErr) {
      return res.status(201).json({ success: true, data: reviewData });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
