const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // 🔥 IMPORTANTE

// PUBLIC
router.get('/public', productsController.getPublicProducts);
router.get('/public/:id', productsController.getPublicProductById);

// ADMIN
router.get('/', auth, productsController.getProducts);
router.get('/:id', auth, productsController.getProductById);

// 🔥 Agora aceita imagem no cadastro
router.post('/', auth, upload.single('image'), productsController.createProduct);

// 🔥 Agora aceita imagem na atualização também
router.put('/:id', auth, upload.single('image'), productsController.updateProduct);

router.delete('/:id', auth, productsController.deleteProduct);

router.patch('/reorder', auth, productsController.reorderProducts);

// mover produto
router.post('/:id/move', auth, productsController.moveProduct);

module.exports = router;
