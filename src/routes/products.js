const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// PUBLIC
router.get('/public', controller.getPublicProducts);

// ADMIN
router.get('/', auth, controller.getProducts);
router.post('/', auth, upload.single('image'), controller.createProduct);
router.put('/:id', auth, upload.single('image'), controller.updateProduct);
router.patch('/:id/stock', auth, controller.toggleStock);
router.delete('/:id', auth, controller.deleteProduct);
router.post('/:id/move', auth, controller.moveProduct);

module.exports = router;
