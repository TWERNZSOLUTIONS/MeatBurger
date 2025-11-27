const loyaltyService = require('../services/loyaltyService');

// Listar cartões fidelidade
exports.getCards = async (req, res) => {
  try {
    const cards = await loyaltyService.getCards();
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar cartões fidelidade." });
  }
};

// Registrar pedido do cliente
exports.recordPurchase = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Nome e telefone são obrigatórios." });
    }

    const card = await loyaltyService.recordPurchase({ name, phone });
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar compra para fidelidade." });
  }
};

// Salvar/editar prêmio e meta
exports.setReward = async (req, res) => {
  try {
    const { reward, rewardTarget } = req.body;
    if (!reward || !rewardTarget) {
      return res.status(400).json({ error: "Brinde e meta obrigatórios." });
    }

    const result = await loyaltyService.setReward({ reward, rewardTarget });
    res.json(result);
  } catch (err) {
    console.error("Erro ao salvar prêmio:", err);
    res.status(500).json({ error: "Erro ao salvar prêmio." });
  }
};

// Buscar prêmio/meta atual
exports.getReward = async (req, res) => {
  try {
    const rewardData = await loyaltyService.getReward();
    res.json(rewardData);
  } catch (err) {
    console.error("Erro ao buscar prêmio:", err);
    res.status(500).json({ error: "Erro ao buscar prêmio." });
  }
};

// Obter prêmio/meta atual
exports.getReward = async (req, res) => {
  try {
    const setting = await require('../services/loyaltyService').getReward();
    res.json(setting || { reward: "", rewardTarget: 0 });
  } catch (err) {
    console.error("Erro ao buscar prêmio:", err);
    res.status(500).json({ error: "Erro ao buscar prêmio." });
  }
};

