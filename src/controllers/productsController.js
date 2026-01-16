const productsService = require('../services/productsService');

// =========================
// PÚBLICO
// =========================

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

// =========================
// ADMIN
// =========================

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

    const flavors = data.flavors ? JSON.parse(data.flavors) : [];

    const product = await productsService.createProduct({
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      position: data.position ? Number(data.position) : 999,
      imageUrl: req.file?.path || '',
      outOfStock: false,
      flavors
    });

    res.json(product);
  } catch (err) {
    console.error('Erro createProduct:', err);
    res.status(500).json({ error: 'Erro ao criar produto.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = req.body;

    let flavors;
    if (
      data.flavors !== undefined &&
      data.flavors !== '' &&
      data.flavors !== 'undefined' &&
      data.flavors !== 'null'
    ) {
      flavors = JSON.parse(data.flavors);
    }

    const product = await productsService.updateProduct(req.params.id, {
      name: data.name,
      description: data.description,
      price: data.price !== undefined ? Number(data.price) : undefined,
      categoryId:
        data.categoryId !== undefined ? Number(data.categoryId) : undefined,
      position:
        data.position !== undefined ? Number(data.position) : undefined,
      ...(req.file && { imageUrl: req.file.path }),
      flavors
    });

    res.json(product);
  } catch (err) {
    console.error('Erro updateProduct:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
};

// =========================
// ESGOTAR / REATIVAR (AJUSTADO)
// =========================

exports.toggleProductStock = async (req, res) => {
  try {
    const updated = await productsService.toggleProductStock(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productsService.deleteProduct(req.params.id);
    res.json({ message: 'Produto removido com sucesso.' });
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
    res.status(500).json({ error: err.message });
  }
};

// =========================
// SABORES (INALTERADO)
// =========================

exports.getFlavors = async (req, res) => {
  try {
    const flavors = await productsService.getFlavors(req.params.id);
    res.json(flavors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar sabores.' });
  }
};

exports.createFlavor = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome obrigatório.' });

    const flavor = await productsService.createFlavor({
      productId: Number(req.params.id),
      name,
      price: price ? Number(price) : 0
    });

    res.json(flavor);
  } catch (err) {
    console.error('Erro createFlavor:', err);
    res.status(500).json({ error: 'Erro ao criar sabor.' });
  }
};

exports.updateFlavor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const flavorExists = await productsService.getFlavorById(id);
    if (!flavorExists) {
      return res.status(404).json({ error: 'Sabor não encontrado.' });
    }

    const updated = await productsService.updateFlavor(id, {
      name: req.body.name,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined
    });

    res.json(updated);
  } catch (err) {
    console.error('Erro updateFlavor:', err);
    res.status(500).json({ error: 'Erro ao atualizar sabor.' });
  }
};

exports.deleteFlavor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const flavor = await productsService.getFlavorById(id);
    if (!flavor) {
      return res.status(404).json({ error: 'Sabor não encontrado.' });
    }

    await productsService.deleteFlavor(id);

    res.json({ message: 'Sabor removido com sucesso.' });
  } catch (err) {
    console.error('Erro deleteFlavor:', err);
    if (err.code === 'P2003') {
      return res.status(400).json({
        error: 'Não é possível remover o sabor: há produtos relacionados.'
      });
    }
    res.status(500).json({ error: 'Erro ao remover sabor.' });
  }
};
