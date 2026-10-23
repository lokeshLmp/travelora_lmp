const Destination = require('../models/Destination');

/**
 * @desc    Get all destinations with search & filters
 * @route   GET /api/destinations
 * @access  Public
 */
exports.getDestinations = async (req, res) => {
  try {
    const { search, category, budget, rating, sort } = req.query;
    
    let query = {};

    // Search by name or country
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by budget ceiling
    if (budget) {
      query.startingPrice = { $lte: Number(budget) };
    }

    // Filter by rating floor
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let apiQuery = Destination.find(query);

    // Sorting options
    if (sort) {
      if (sort === 'lowest') {
        apiQuery = apiQuery.sort({ startingPrice: 1 });
      } else if (sort === 'highest') {
        apiQuery = apiQuery.sort({ startingPrice: -1 });
      } else if (sort === 'rating') {
        apiQuery = apiQuery.sort({ rating: -1 });
      } else {
        apiQuery = apiQuery.sort({ name: 1 });
      }
    } else {
      // Default recommended sorting (by rating)
      apiQuery = apiQuery.sort({ rating: -1 });
    }

    const destinations = await apiQuery;
    res.status(200).json({ success: true, count: destinations.length, data: destinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get single destination by ID
 * @route   GET /api/destinations/:id
 * @access  Public
 */
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, data: destination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Create a destination
 * @route   POST /api/destinations
 * @access  Private/Admin
 */
exports.createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, message: 'Destination created successfully', data: destination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update a destination
 * @route   PUT /api/destinations/:id
 * @access  Private/Admin
 */
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, message: 'Destination updated successfully', data: destination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Delete a destination
 * @route   DELETE /api/destinations/:id
 * @access  Private/Admin
 */
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.status(200).json({ success: true, message: 'Destination deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
