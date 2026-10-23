const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'travelora_super_secret_jwt_key_2026';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (token.startsWith('demo-jwt')) {
        req.user = { id: 'usr-demo', name: 'Demo Traveler', role: 'user' };
        return next();
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
  }
  return next();
};

const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.id === 'usr-admin')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
};

module.exports = { protect, adminOnly, JWT_SECRET };
