const productsService = require('../services/productsService');

// ========= PUBLIC =========
exports.getPublicProducts = async (req, res) => {
  try {
    const products = await productsService.getProducts({ publicOnly: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos públicos.' });
  }
};

// ========= ADMIN =========
exports.getProducts = async (req, res) => {
  try {
    const products = await productsService.getProducts({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;

    const product = await productsService.createProduct({
      name: data.name,
      description: data.description || "",
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      position: 999,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = req.body;

    const updated = await productsService.updateProduct(
      Number(req.params.id),
      {
        ...data,
        price: data.price ? Number(data.price) : undefined,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
};

exports.toggleStock = async (req, res) => {
  try {
    const product = await productsService.toggleStock(Number(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao alterar estoque.' });
  }
};

exports.deleteProduct = async (req, res) => {
  await productsService.deleteProduct(req.params.id);
  res.json({ ok: true });
};

exports.moveProduct = async (req, res) => {
  const result = await productsService.moveProduct(
    req.params.id,
    req.body.direction
  );
  res.json(result);
};
