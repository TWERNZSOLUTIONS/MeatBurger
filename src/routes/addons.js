const express = require('express');
const router = express.Router();
const addonsController = require('../controllers/addonsController');
const auth = require('../middleware/auth');

// PUBLIC
router.get('/public', addonsController.getPublicAddons);

// ADMIN
router.get('/', auth, addonsController.getAddons);
router.post('/', auth, addonsController.createAddon);
router.put('/:id', auth, addonsController.updateAddon);
router.delete('/:id', auth, addonsController.deleteAddon);
router.patch('/reorder', auth, addonsController.reorderAddons);

module.exports = router;
