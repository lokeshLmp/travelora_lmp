const express = require('express');
const router = express.Router();
const { getHotels, getHotelById } = require('../controllers/hotelController');

router.get('/', getHotels);
router.get('/:id', getHotelById);

module.exports = router;
