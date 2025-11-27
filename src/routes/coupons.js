const express = require('express');
const router = express.Router();
const couponsController = require('../controllers/couponsController');
const auth = require('../middleware/auth');

// PUBLIC
// aceita: GET /coupons/validate?code=XXX  ou GET /coupons/validate/XXX
router.get('/validate', couponsController.validateCoupon);
router.get('/validate/:code', couponsController.validateCoupon);

// ADMIN
router.get('/', auth, couponsController.getCoupons);
router.post('/', auth, couponsController.createCoupon);
router.put('/:id', auth, couponsController.updateCoupon);
router.patch('/:id/deactivate', auth, couponsController.deactivateCoupon); // nova rota
router.delete('/:id', auth, couponsController.deleteCoupon);

module.exports = router;
