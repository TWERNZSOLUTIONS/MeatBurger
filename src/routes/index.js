// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));
router.use('/addons', require('./addons'));
router.use('/orders', require('./orders'));
router.use('/coupons', require('./coupons'));
router.use('/loyalty', require('./loyalty'));
router.use('/reports', require('./reports'));
router.use('/settings', require('./settings'));

// A linha de clientes foi removida
// router.use('/customers', require('./customers'));

module.exports = router;
