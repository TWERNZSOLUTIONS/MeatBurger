const settingsService = require('../services/settingsService');

exports.getSettingsPublic = async (req, res) => {
  try {
    const settings = await settingsService.getSettingsPublic();
    return res.json(settings);
  } catch (err) {
    console.error('Erro ao obter settings públicos:', err);
    return res.status(500).json({ error: 'Erro ao buscar configurações públicas.' });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await settingsService.getSettings();
    return res.json(settings);
  } catch (err) {
    console.error('Erro ao obter settings admin:', err);
    return res.status(500).json({ error: 'Erro ao buscar configurações.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const data = {
      ...req.body,
      daysOpen: req.body.daysOpen ? JSON.parse(req.body.daysOpen) : [],
      manualClosed: !!req.body.manualClosed,
      manualCloseReason: req.body.manualCloseReason || "",
    };
    const settings = await settingsService.updateSettings(data);
    return res.json(settings);
  } catch (err) {
    console.error('Erro ao atualizar settings:', err);
    return res.status(500).json({ error: 'Erro ao atualizar configurações.' });
  }
};
