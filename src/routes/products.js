const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// 🔥 IMPORTAR PRISMA PARA A ROTA DE DEBUG FUNCIONAR
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

// ==========================
// DEBUG — Encontrar produtos órfãos
// ==========================
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

    return res.json({
      total: orphanProducts.length,
      items: orphanProducts
    });
  } catch (error) {
    console.error("Erro debug orphans:", error);
    return res.status(500).json({ error: error.message });
  }
});

// NUNCA COLOQUE NADA DEPOIS DISSO
module.exports = router;
