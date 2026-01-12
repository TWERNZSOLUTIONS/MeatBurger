const productsService = require('../services/productsService');

// ===== PÚBLICO =====
exports.getPublicProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const products = await productsService.getProducts({
      categoryId,
      publicOnly: true
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos públicos.' });
  }
};

exports.getPublicProductById = async (req, res) => {
  try {
    const product = await productsService.getProductById(req.params.id);
    if (!product || product.outOfStock) {
      return res.status(404).json({ error: 'Produto não disponível.' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto público.' });
  }
};

// ===== ADMIN =====
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
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
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
      return res.status(400).json({
        error: 'Nome, preço e categoria são obrigatórios.'
      });
    }

    const productData = {
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      position: data.position ? Number(data.position) : 999,
      imageUrl: '',
      outOfStock: false
    };

    if (req.file?.path) {
      productData.imageUrl = req.file.path;
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

    const productData = {
      name: data.name,
      description: data.description,
      price: data.price !== undefined ? Number(data.price) : undefined,
      categoryId: data.categoryId !== undefined ? Number(data.categoryId) : undefined,
      position: data.position !== undefined ? Number(data.position) : undefined,
      outOfStock:
        data.outOfStock !== undefined
          ? data.outOfStock === true || data.outOfStock === 'true'
          : undefined
    };

    if (req.file?.path) {
      productData.imageUrl = req.file.path;
    }

    const updated = await productsService.updateProduct(
      Number(req.params.id),
      productData
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
};

// 🔥 ESGOTAR / ATIVAR
exports.toggleProductStock = async (req, res) => {
  try {
    const updated = await productsService.toggleProductStock(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao alterar estoque do produto.' });
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
    const updated = await productsService.moveProduct(
      req.params.id,
      req.body.direction
    );
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
