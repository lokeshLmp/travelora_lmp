const Hotel = require('../models/Hotel');
const demoData = require('../data/demoData.json');

exports.getHotels = async (req, res) => {
  try {
    const { destination, maxPrice, rating, search } = req.query;
    try {
      let filter = {};
      if (destination) filter.destination = new RegExp(destination, 'i');
      if (maxPrice) filter.pricePerNight = { $lte: Number(maxPrice) };
      if (rating) filter.rating = { $gte: Number(rating) };
      if (search) {
        filter.$or = [
          { name: new RegExp(search, 'i') },
          { location: new RegExp(search, 'i') }
        ];
      }
      const hotels = await Hotel.find(filter);
      if (hotels && hotels.length > 0) {
        return res.json({ success: true, data: hotels });
      }
    } catch (err) {}

    // Demo Data Fallback
    let result = [...demoData.hotels];
    if (destination && destination !== 'All') {
      result = result.filter(h => h.destination.toLowerCase().includes(destination.toLowerCase()));
    }
    if (maxPrice) {
      result = result.filter(h => h.pricePerNight <= Number(maxPrice));
    }
    if (rating) {
      result = result.filter(h => h.rating >= Number(rating));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(h => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q));
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const hotel = await Hotel.findOne({ id });
      if (hotel) return res.json({ success: true, data: hotel });
    } catch (err) {}

    const found = demoData.hotels.find(h => h.id === id);
    if (found) return res.json({ success: true, data: found });
    return res.status(404).json({ success: false, message: 'Hotel not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
