const addonsService = require('../services/addonsService');

// =========================
// PÚBLICO
// =========================
exports.getPublicAddons = async (req, res) => {
  try {
    const addons = await addonsService.getAddons({ publicOnly: true });
    res.json(addons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar adicionais públicos.' });
  }
};

// =========================
// ADMIN
// =========================
exports.getAddons = async (req, res) => {
  try {
    const addons = await addonsService.getAddons();
    res.json(addons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar adicionais.' });
  }
};

exports.createAddon = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios.' });
    }

    const addon = await addonsService.createAddon({
      name,
      price: Number(price),
      categoryId: Number(categoryId),
      outOfStock: false,
      position: req.body.position ? Number(req.body.position) : 999
    });

    res.json(addon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar adicional.' });
  }
};

exports.updateAddon = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const updated = await addonsService.updateAddon(id, {
      name: data.name,
      price: data.price !== undefined ? Number(data.price) : undefined,
      categoryId: data.categoryId !== undefined ? Number(data.categoryId) : undefined,
      position: data.position !== undefined ? Number(data.position) : undefined
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar adicional.' });
  }
};

// =========================
// ESGOTAR / ATIVAR
// =========================
exports.toggleAddonStock = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await addonsService.toggleAddonStock(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// =========================
// DELETAR
// =========================
exports.deleteAddon = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await addonsService.deleteAddon(id);
    res.json({ message: 'Adicional removido com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover adicional.' });
  }
};

// =========================
// REORDENAR
// =========================
exports.reorderAddons = async (req, res) => {
  try {
    const { order } = req.body; // order = [{id: 1, position: 1}, ...]
    const updated = await addonsService.reorderAddons(order);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao reordenar adicionais.' });
  }
};
