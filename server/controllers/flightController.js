const Flight = require('../models/Flight');

/**
 * @desc    Search and filter flights
 * @route   GET /api/flights
 * @access  Public
 */
exports.getFlights = async (req, res) => {
  try {
    const { from, to, date, priceMax, airline, sort } = req.query;
    let query = {};

    if (from) {
      query.from = { $regex: from, $options: 'i' };
    }
    if (to) {
      query.to = { $regex: to, $options: 'i' };
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.departureTime = { $gte: startOfDay, $lte: endOfDay };
    }

    if (priceMax) {
      query.price = { $lte: Number(priceMax) };
    }

    if (airline) {
      query.airline = { $regex: airline, $options: 'i' };
    }

    let apiQuery = Flight.find(query);

    if (sort) {
      if (sort === 'price_asc') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sort === 'price_desc') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sort === 'departure') {
        apiQuery = apiQuery.sort({ departureTime: 1 });
      }
    } else {
      apiQuery = apiQuery.sort({ price: 1 });
    }

    const flights = await apiQuery;
    res.status(200).json({ success: true, count: flights.length, data: flights });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get single flight details (including seat configurations)
 * @route   GET /api/flights/:id
 * @access  Public
 */
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    res.status(200).json({ success: true, data: flight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Lock seat for traveler (Pre-booking check)
 * @route   POST /api/flights/:id/seats/select
 * @access  Private
 */
exports.selectSeat = async (req, res) => {
  try {
    const { seatNumber } = req.body;
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    const seat = flight.seats.find(s => s.seatNumber === seatNumber);
    if (!seat) {
      return res.status(400).json({ success: false, message: `Seat ${seatNumber} does not exist on this flight` });
    }

    if (seat.status === 'BOOKED') {
      return res.status(400).json({ success: false, message: `Seat ${seatNumber} is already booked` });
    }

    // Toggle/select seat locally
    if (seat.status === 'SELECTED' && seat.lockedBy?.toString() !== req.user.id) {
      return res.status(400).json({ success: false, message: `Seat ${seatNumber} is currently selected by another user` });
    }

    if (seat.status === 'SELECTED' && seat.lockedBy?.toString() === req.user.id) {
      // De-select
      seat.status = 'AVAILABLE';
      seat.lockedBy = null;
      seat.lockedAt = null;
    } else {
      // Select
      seat.status = 'SELECTED';
      seat.lockedBy = req.user.id;
      seat.lockedAt = new Date();
    }

    await flight.save();

    res.status(200).json({
      success: true,
      message: seat.status === 'SELECTED' ? `Seat ${seatNumber} selected` : `Seat ${seatNumber} released`,
      data: flight.seats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Create flight (Admin)
 * @route   POST /api/flights
 * @access  Private/Admin
 */
exports.createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, data: flight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update flight (Admin)
 * @route   PUT /api/flights/:id
 * @access  Private/Admin
 */
exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    res.status(200).json({ success: true, data: flight });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Delete flight (Admin)
 * @route   DELETE /api/flights/:id
 * @access  Private/Admin
 */
exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }
    res.status(200).json({ success: true, message: 'Flight deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
