const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', flightController.getFlights);
router.get('/:id', flightController.getFlightById);
router.post('/:id/seats/select', protect, flightController.selectSeat);

// Admin operations
router.post('/', protect, adminOnly, flightController.createFlight);
router.put('/:id', protect, adminOnly, flightController.updateFlight);
router.delete('/:id', protect, adminOnly, flightController.deleteFlight);

module.exports = router;
