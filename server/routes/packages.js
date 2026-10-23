const express = require('express');
const router = express.Router();
const { getPackages, getPackageById } = require('../controllers/packageController');

router.get('/', getPackages);
router.get('/:id', getPackageById);

module.exports = router;
