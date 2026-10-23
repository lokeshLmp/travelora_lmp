const aiService = require('../services/aiService');
const priceInsight = require('../services/priceInsight');
const Booking = require('../models/Booking');
const sustainability = require('../services/sustainability');

/**
 * @desc    Plan custom trip using AI service
 * @route   POST /api/ai/plan-trip
 * @access  Public
 */
exports.planTrip = async (req, res) => {
  try {
    const {
      destination,
      durationDays,
      budget,
      travelers,
      travelType,
      interests,
      priority
    } = req.body;

    if (!destination || !durationDays) {
      return res.status(400).json({ success: false, message: 'Please provide destination and duration' });
    }

    const tripPlan = await aiService.generateItinerary({
      destinationName: destination,
      durationDays,
      budget: budget || 'Balanced',
      travelersCount: travelers ? Number(travelers) : 1,
      travelType: travelType || 'Solo',
      interests: interests || [],
      priority: priority || 'Balanced'
    });

    res.status(200).json({
      success: true,
      message: 'Itinerary generated successfully',
      data: tripPlan
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get personalized travel recommendation
 * @route   GET /api/recommendations
 * @access  Public
 */
exports.getRecommendations = async (req, res) => {
  try {
    // If authenticated, pass user id, otherwise returns default popularity scoring
    const userId = req.user ? req.user.id : null;
    const recommendations = await aiService.getPersonalizedRecommendations(userId);
    res.status(200).json({ success: true, data: recommendations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get pricing insights trend recommendation
 * @route   GET /api/prices/insight/:itemId
 * @access  Public
 */
exports.getPriceInsight = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { price } = req.query;

    if (!price) {
      return res.status(400).json({ success: false, message: 'Please provide current price query param' });
    }

    const insight = priceInsight.getPriceInsight(itemId, Number(price));
    res.status(200).json({ success: true, data: insight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get carbon footprint metrics on booking
 * @route   GET /api/sustainability/:bookingId
 * @access  Private
 */
exports.getSustainabilityReport = async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId })
      .populate('flight')
      .populate('hotel');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const report = sustainability.getSustainabilityReport(booking);
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
