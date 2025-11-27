const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const auth = require('../middleware/auth');

// ADMIN only
router.get('/orders', auth, reportsController.getOrdersReport);

module.exports = router;
