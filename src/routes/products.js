const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// ==========================
// PUBLIC ROUTES
// ==========================
router.get('/public', productsController.getPublicProducts);
router.get('/public/:id', productsController.getPublicProductById);

// ==========================
// ADMIN ROUTES
// ==========================
router.get('/', auth, productsController.getProducts);
router.get('/:id', auth, productsController.getProductById);

// Create product (with image)
router.post('/', auth, upload.single('image'), productsController.createProduct);

// Update product (with image)
router.put('/:id', auth, upload.single('image'), productsController.updateProduct);

// Delete product
router.delete('/:id', auth, productsController.deleteProduct);

// Reorder products
router.patch('/reorder', auth, productsController.reorderProducts);

// Move product
router.post('/:id/move', auth, productsController.moveProduct);

// ...todas as rotas acima...

// DEBUG — Encontrar produtos sem categoria ou com categoria inválida
router.get("/debug/orphans", async (req, res) => {
  try {
    const orphanProducts = await prisma.product.findMany({
      where: {
        OR: [
          { categoryId: null },
          { category: null }
        ]
      }
    });

    res.json(orphanProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NUNCA DEIXAR ABAIXO DISSO
module.exports = router;

module.exports = router;
