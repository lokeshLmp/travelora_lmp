const Package = require('../models/Package');
const demoData = require('../data/demoData.json');

exports.getPackages = async (req, res) => {
  try {
    const { destination, category, maxPrice, search } = req.query;
    try {
      let filter = {};
      if (destination) filter.destination = new RegExp(destination, 'i');
      if (category && category !== 'All') filter.category = new RegExp(category, 'i');
      if (maxPrice) filter.price = { $lte: Number(maxPrice) };
      if (search) {
        filter.$or = [
          { title: new RegExp(search, 'i') },
          { destination: new RegExp(search, 'i') }
        ];
      }
      const packages = await Package.find(filter);
      if (packages && packages.length > 0) {
        return res.json({ success: true, data: packages });
      }
    } catch (err) {}

    // Demo Data Fallback
    let result = [...demoData.packages];
    if (destination) {
      result = result.filter(p => p.destination.toLowerCase().includes(destination.toLowerCase()));
    }
    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q));
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const pkg = await Package.findOne({ id });
      if (pkg) return res.json({ success: true, data: pkg });
    } catch (err) {}

    const found = demoData.packages.find(p => p.id === id);
    if (found) return res.json({ success: true, data: found });
    return res.status(404).json({ success: false, message: 'Package not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
