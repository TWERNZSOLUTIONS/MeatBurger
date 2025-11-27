const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// ROTA PÚBLICA — FRONTEND USA ESTA
router.get('/public', settingsController.getSettingsPublic);

// ROTAS PROTEGIDAS — ADMIN
router.get('/', auth, settingsController.getSettings);
router.patch('/', auth, settingsController.updateSettings);

module.exports = router;
