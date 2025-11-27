const productsService = require('../services/productsService');

// ========== PÚBLICO ==========
exports.getPublicProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const products = await productsService.getProducts({ categoryId });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos públicos.' });
  }
};

exports.getPublicProductById = async (req, res) => {
  try {
    const product = await productsService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto público.' });
  }
};

// ========== ADMIN ==========
exports.getProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const products = await productsService.getProducts({ categoryId });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productsService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto.' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.price || !data.categoryId) {
      return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios.' });
    }

    const productData = {
      name: data.name,
      description: data.description || "",
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      position: data.position ? Number(data.position) : 999,
    };

    if (req.file) {
      productData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await productsService.createProduct(productData);
    res.json(product);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = req.body;

    // Apenas campos enviados serão atualizados
    const productData = {};

    if (data.name !== undefined) productData.name = data.name;
    if (data.description !== undefined) productData.description = data.description;
    if (data.price !== undefined) productData.price = Number(data.price);
    if (data.categoryId !== undefined) productData.categoryId = Number(data.categoryId);
    if (data.position !== undefined) productData.position = Number(data.position);

    // Atualizar imagem caso enviada
    if (req.file) {
      productData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await productsService.updateProduct(
      Number(req.params.id),
      productData
    );

    res.json(updatedProduct);

  } catch (err) {
    console.error("Erro no updateProduct:", err);
    res.status(500).json({ error: "Erro ao atualizar produto." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productsService.deleteProduct(req.params.id);
    res.json({ message: 'Produto removido com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover produto.' });
  }
};

exports.moveProduct = async (req, res) => {
  try {
    const updated = await productsService.moveProduct(req.params.id, req.body.direction);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao mover produto.' });
  }
};

exports.reorderProducts = async (req, res) => {
  try {
    const updated = await productsService.reorderProducts(req.body.order);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao reordenar produtos.' });
  }
};
