const Destination = require('../models/Destination');
const demoData = require('../data/demoData.json');

exports.getDestinations = async (req, res) => {
  try {
    const { category } = req.query;
    try {
      let filter = {};
      if (category && category !== 'All') {
        filter.category = new RegExp(category, 'i');
      }
      const destinations = await Destination.find(filter);
      if (destinations && destinations.length > 0) {
        return res.json({ success: true, data: destinations });
      }
    } catch (err) {}

    // Demo Data Fallback
    let result = demoData.destinations;
    if (category && category !== 'All') {
      result = result.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const dest = await Destination.findOne({ id });
      if (dest) return res.json({ success: true, data: dest });
    } catch (err) {}

    const found = demoData.destinations.find(d => d.id === id);
    if (found) return res.json({ success: true, data: found });
    return res.status(404).json({ success: false, message: 'Destination not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
