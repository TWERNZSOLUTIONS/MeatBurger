const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/public', productsController.getPublicProducts);
router.get('/public/:id', productsController.getPublicProductById);

router.get('/', auth, productsController.getProducts);
router.get('/:id', auth, productsController.getProductById);

router.post('/', auth, upload.single('image'), productsController.createProduct);
router.put('/:id', auth, upload.single('image'), productsController.updateProduct);

router.patch('/:id/stock', auth, productsController.toggleProductStock);

router.delete('/:id', auth, productsController.deleteProduct);
router.post('/:id/move', auth, productsController.moveProduct);

router.get('/:id/flavors', auth, productsController.getFlavors);
router.post('/:id/flavors', auth, productsController.createFlavor);
router.put('/flavors/:id', auth, productsController.updateFlavor);
router.delete('/flavors/:id', auth, productsController.deleteFlavor);

module.exports = router;
