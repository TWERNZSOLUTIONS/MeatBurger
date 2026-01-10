const loyaltyService = require("../services/loyaltyService");

// ADMIN
exports.getCards = async (req, res) => {
  try {
    const cards = await loyaltyService.getCards();
    res.json(cards);
  } catch (err) {
    console.error("Erro cartões fidelidade:", err);
    res.status(500).json({ error: "Erro ao buscar cartões fidelidade." });
  }
};

// PUBLIC — NUNCA QUEBRA CHECKOUT
exports.recordPurchase = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Se não tiver dados mínimos, ignora fidelidade
    if (!name || !phone) {
      return res.json({ success: true, ignored: true });
    }

    await loyaltyService.recordPurchase({ name, phone });

    res.json({ success: true });
  } catch (err) {
    // LOGA MAS NÃO QUEBRA
    console.error("Falha fidelidade (ignorada):", err.message);
    res.json({ success: true, ignored: true });
  }
};

// ADMIN
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

exports.getReward = async (req, res) => {
  try {
    const rewardData = await loyaltyService.getReward();
    res.json(rewardData || { reward: "", rewardTarget: 0 });
  } catch (err) {
    console.error("Erro ao buscar prêmio:", err);
    res.status(500).json({ error: "Erro ao buscar prêmio." });
  }
};
