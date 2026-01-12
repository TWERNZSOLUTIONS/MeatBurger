const addonsService = require('../services/addonsService');

// ===== PÚBLICO =====
exports.getPublicAddons = async (req, res) => {
  try {
    const addons = await addonsService.getAddons({ publicOnly: true });
    res.json(addons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar adicionais públicos.' });
  }
};

// ===== ADMIN =====
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
    const data = {
      ...req.body,
      price: Number(req.body.price),
      outOfStock: false
    };

    const addon = await addonsService.createAddon(data);
    res.json(addon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar adicional.' });
  }
};

exports.updateAddon = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      price:
        req.body.price !== undefined ? Number(req.body.price) : undefined,
      outOfStock:
        req.body.outOfStock !== undefined
          ? req.body.outOfStock === true || req.body.outOfStock === 'true'
          : undefined
    };

    const addon = await addonsService.updateAddon(req.params.id, data);
    res.json(addon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar adicional.' });
  }
};

// 🔥 ESGOTAR / ATIVAR
exports.toggleAddonStock = async (req, res) => {
  try {
    const updated = await addonsService.toggleAddonStock(req.params.id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao alterar estoque do adicional.' });
  }
};

exports.deleteAddon = async (req, res) => {
  try {
    await addonsService.deleteAddon(req.params.id);
    res.json({ message: 'Adicional removido com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover adicional.' });
  }
};

exports.reorderAddons = async (req, res) => {
  try {
    const updated = await addonsService.reorderAddons(req.body.order);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao reordenar adicionais.' });
  }
};
