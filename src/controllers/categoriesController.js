const categoriesService = require('../services/categoriesService');

// ========== PÚBLICO ==========
exports.getCategoriesPublic = async (req, res) => {
  try {
    const categories = await categoriesService.getCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias públicas.' });
  }
};

// ========== ADMIN ==========
exports.getCategories = async (req, res) => {
  try {
    const categories = await categoriesService.getCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias.' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await categoriesService.createCategory(req.body);
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar categoria.' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await categoriesService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar categoria.' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await categoriesService.deleteCategory(req.params.id);
    res.json({ message: 'Categoria removida com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover categoria.' });
  }
};

// === NOVO: mover categoria ===
exports.moveCategory = async (req, res) => {
  try {
    const updated = await categoriesService.moveCategory(req.params.id, req.body.direction);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao mover categoria.' });
  }
};

exports.reorderCategories = async (req, res) => {
  try {
    const updated = await categoriesService.reorderCategories(req.body.order);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao reordenar categorias.' });
  }
};
