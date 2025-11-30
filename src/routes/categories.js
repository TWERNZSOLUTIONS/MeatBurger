const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categoriesController');
const auth = require('../middleware/auth');

// ==========================
// PUBLIC
// ==========================
router.get('/public', categoriesController.getCategoriesPublic);

// ==========================
// ADMIN
// ==========================
router.get('/', auth, categoriesController.getCategories);
router.post('/', auth, categoriesController.createCategory);
router.put('/:id', auth, categoriesController.updateCategory);
router.delete('/:id', auth, categoriesController.deleteCategory);
router.patch('/reorder', auth, categoriesController.reorderCategories);

// Move category
router.post('/:id/move', auth, categoriesController.moveCategory);

module.exports = router;
