const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.post('/plan-trip', aiController.planTrip);
router.get('/recommendations', optionalAuth, aiController.getRecommendations);
router.get('/prices/insight/:itemId', aiController.getPriceInsight);
router.get('/sustainability/:bookingId', protect, aiController.getSustainabilityReport);

module.exports = router;
