const productsService = require('../services/productsService');

exports.getPublicProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const products = await productsService.getProducts({ categoryId, publicOnly: true });
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

    let flavors = [];
    if (typeof data.flavors === 'string' && data.flavors.trim() !== '') {
      try {
        flavors = JSON.parse(data.flavors);
      } catch {
        flavors = [];
      }
    }

    const product = await productsService.createProduct({
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      categoryId: Number(data.categoryId),
      position: data.position ? Number(data.position) : 999,
      imageUrl: req.file?.path || '',
      outOfStock: false,
      flavors,
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = req.body;

    let flavors;
    if (typeof data.flavors === 'string' && data.flavors.trim() !== '') {
      try {
        flavors = JSON.parse(data.flavors);
      } catch {
        flavors = undefined;
      }
    }

    const payload = {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && !isNaN(Number(data.price)) && { price: Number(data.price) }),
      ...(data.categoryId !== undefined && { categoryId: Number(data.categoryId) }),
      ...(data.position !== undefined && { position: Number(data.position) }),
      ...(req.file && { imageUrl: req.file.path }),
      ...(flavors !== undefined && { flavors }),
    };

    const product = await productsService.updateProduct(req.params.id, payload);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
};

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
    const updated = await productsService.moveProduct(req.params.id, req.body.direction);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

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
      price: price ? Number(price) : 0,
    });

    res.json(flavor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar sabor.' });
  }
};

exports.updateFlavor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const flavorExists = await productsService.getFlavorById(id);
    if (!flavorExists) return res.status(404).json({ error: 'Sabor não encontrado.' });

    const updated = await productsService.updateFlavor(id, {
      ...(req.body.name !== undefined && { name: req.body.name }),
      ...(req.body.price !== undefined && { price: Number(req.body.price) }),
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar sabor.' });
  }
};

exports.deleteFlavor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const flavor = await productsService.getFlavorById(id);
    if (!flavor) return res.status(404).json({ error: 'Sabor não encontrado.' });

    await productsService.deleteFlavor(id);
    res.json({ message: 'Sabor removido com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover sabor.' });
  }
};
