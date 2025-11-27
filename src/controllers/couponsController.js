const couponsService = require('../services/couponsService');

// PUBLIC: validar cupom (aceita query ?code= or path param /validate/:code)
exports.validateCoupon = async (req, res) => {
  try {
    const code = (req.query.code || req.params.code || "").trim();
    if (!code) {
      return res.status(400).json({ error: "Informe o código do cupom." });
    }

    const coupon = await couponsService.findByCode(code);
    if (!coupon) {
      return res.status(404).json({ valid: false, reason: "Cupom não encontrado" });
    }

    const now = new Date();

    if (!coupon.active) {
      return res.json({ valid: false, reason: "Cupom inativo" });
    }

    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return res.json({ valid: false, reason: "Cupom ainda não está válido" });
    }

    if (coupon.endsAt && new Date(coupon.endsAt) < now) {
      return res.json({ valid: false, reason: "Cupom expirado" });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.json({ valid: false, reason: "Limite de uso atingido" });
    }

    return res.json({
      valid: true,
      percentage: coupon.percentage,
      coupon,
    });

  } catch (err) {
    console.error("validateCoupon error:", err);
    return res.status(500).json({ error: "Erro ao validar cupom." });
  }
};

// ADMIN
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await couponsService.getCoupons();
    res.json(coupons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar cupons.' });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await couponsService.createCoupon(req.body);
    res.json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar cupom.' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await couponsService.updateCoupon(req.params.id, req.body);
    res.json(coupon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cupom.' });
  }
};

// NOVA AÇÃO: desativar cupom (marca active = false)
exports.deactivateCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    const coupon = await couponsService.updateCoupon(id, { active: false });
    res.json({ success: true, coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao desativar cupom.' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    await couponsService.deleteCoupon(req.params.id);
    res.json({ message: 'Cupom removido com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover cupom.' });
  }
};
