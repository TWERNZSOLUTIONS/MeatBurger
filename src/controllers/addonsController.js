const addonsService = require('../services/addonsService');

// ========== PÚBLICO ==========
exports.getPublicAddons = async (req, res) => {
  try {
    const addons = await addonsService.getAddons();
    res.json(addons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar adicionais públicos.' });
  }
};

// ========== ADMIN ==========
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
    const addon = await addonsService.createAddon(req.body);
    res.json(addon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar adicional.' });
  }
};

exports.updateAddon = async (req, res) => {
  try {
    const addon = await addonsService.updateAddon(req.params.id, req.body);
    res.json(addon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar adicional.' });
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
