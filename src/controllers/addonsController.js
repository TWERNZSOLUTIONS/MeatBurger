const addonsService = require('../services/addonsService');

exports.getPublicAddons = async (req, res) => {
  try { const addons = await addonsService.getAddons({ publicOnly: true }); res.json(addons); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Erro ao buscar adicionais públicos.' }); }
};

exports.getAddons = async (req, res) => {
  try { const addons = await addonsService.getAddons(); res.json(addons); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Erro ao buscar adicionais.' }); }
};

exports.createAddon = async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;
    if (!name || !price || !categoryId) return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios.' });
    const addon = await addonsService.createAddon({ name, price: Number(price), categoryId: Number(categoryId), outOfStock: false, position: req.body.position ? Number(req.body.position) : 999 });
    res.json(addon);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro ao criar adicional.' }); }
};

exports.updateAddon = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await addonsService.updateAddon(id, { name: data.name, price: data.price !== undefined ? Number(data.price) : undefined, categoryId: data.categoryId !== undefined ? Number(data.categoryId) : undefined, position: data.position !== undefined ? Number(data.position) : undefined });
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro ao atualizar adicional.' }); }
};

exports.toggleAddonStock = async (req, res) => {
  try { const updated = await addonsService.toggleAddonStock(Number(req.params.id)); res.json(updated); }
  catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
};

exports.deleteAddon = async (req, res) => {
  try { await addonsService.deleteAddon(Number(req.params.id)); res.json({ message: 'Adicional removido com sucesso.' }); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Erro ao remover adicional.' }); }
};

exports.reorderAddons = async (req, res) => {
  try { const { order } = req.body; const updated = await addonsService.reorderAddons(order); res.json(updated); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Erro ao reordenar adicionais.' }); }
};
