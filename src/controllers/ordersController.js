const ordersService = require('../services/ordersService');

exports.createOrder = async (req, res) => {
  const data = req.body || {};

  try {
    // =========================
    // SANITIZAÇÃO DE ITENS
    // =========================
    const orderItems = Array.isArray(data.items)
      ? data.items.map(item => {
          const qty = Number(item.qty) > 0 ? Number(item.qty) : 1;
          const price = Number(item.price) > 0 ? Number(item.price) : 0;

          return {
            productId: item.productId || null,
            name: item.name || 'Item sem nome',
            unitPrice: price,
            quantity: qty,
            totalPrice: price * qty,

            addons: Array.isArray(item.addons)
              ? item.addons.map(add => ({
                  addonId: add.id || null,
                  name: add.name || 'Adicional',
                  price: Number(add.price) || 0
                }))
              : []
          };
        })
      : [];

    if (orderItems.length === 0) {
      return res.status(400).json({
        error: 'Pedido sem itens'
      });
    }

    // =========================
    // PAYLOAD FINAL
    // =========================
    const payload = {
      customerName: data.customer?.name || null,
      customerPhone: data.customer?.phone || null,
      subtotal: Number(data.subtotal) || 0,
      discount: Number(data.discount) || 0,
      total: Number(data.total) || 0,
      couponCode: data.coupon?.code || null,
      orderItems
    };

    // =========================
    // CRIAÇÃO DO PEDIDO (CRÍTICO)
    // =========================
    const order = await ordersService.createOrder(payload);

    // RESPONDE IMEDIATAMENTE
    res.status(201).json(order);

    // =========================
    // QUALQUER PÓS-PROCESSO
    // =========================
    // Se futuramente tiver:
    // fidelidade, logs, notificações, etc
    // NUNCA pode quebrar o fluxo
    try {
      if (ordersService.afterCreateOrder) {
        await ordersService.afterCreateOrder(order);
      }
    } catch (secondaryError) {
      console.error(
        'Erro secundário após criação do pedido:',
        secondaryError
      );
    }

  } catch (err) {
    console.error('Erro crítico ao criar pedido:', err);

    return res.status(500).json({
      error: 'Erro interno ao processar o pedido'
    });
  }
};
