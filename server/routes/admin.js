const express = require('express');
const router = express.Router();
const { getDashboardStats, addPackage, deletePackage } = require('../controllers/adminController');

router.get('/stats', getDashboardStats);
router.post('/packages', addPackage);
router.delete('/packages/:id', deletePackage);

module.exports = router;
