const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cors = require('cors');

// POST /auth/login
router.post('/login', cors(), authController.login);

module.exports = router;
