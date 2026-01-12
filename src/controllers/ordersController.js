const ordersService = require('../services/ordersService');

exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      items,
      total,
      paymentMethod,
      observation
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Pedido sem itens' });
    }

    const normalizedItems = items.map(item => ({
      productId: item.productId,
      name: item.name,
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      addons: Array.isArray(item.addons)
        ? item.addons.map(add => ({
            // REGRA: só manda addonId se for addon real
            addonId: add.type === 'addon' ? add.id : null,
            name: add.name,
            price: Number(add.price) || 0,
          }))
        : [],
    }));

    const order = await ordersService.createOrder({
      customerName,
      customerPhone,
      items: normalizedItems,
      total: Number(total),
      paymentMethod,
      observation,
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({ error: 'Erro interno ao criar pedido' });
  }
};
