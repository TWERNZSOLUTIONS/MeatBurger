const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const addonsController = require('../controllers/addonsController');

// =========================
// PÚBLICO
// =========================
router.get('/', addonsController.getPublicAddons);

// =========================
// ADMIN
// =========================
router.post('/', auth, addonsController.createAddon);
router.put('/:id', auth, addonsController.updateAddon);
router.delete('/:id', auth, addonsController.deleteAddon);

// =========================
// ESGOTAR / REATIVAR
// =========================
router.patch('/:id/stock', auth, addonsController.toggleAddonStock);

module.exports = router;
