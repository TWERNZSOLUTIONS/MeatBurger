const ordersService = require('../services/ordersService');

// ========== PÚBLICO ==========
exports.createOrder = async (req, res) => {
  try {
    const data = req.body;

    // unifica addons, drinks e portions
    const orderItems = (data.items || []).map(item => ({
      productId: item.productId,
      name: item.name,
      unitPrice: item.price,
      quantity: item.qty,
      totalPrice: (item.price || 0) * (item.qty || 1),
      addons: [
        ...(item.addons || []),
        ...(item.drinks || []),
        ...(item.portions || [])
      ]
    }));

    const payload = {
      customerName: data.customer?.name,
      customerPhone: data.customer?.phone,
      subtotal: data.subtotal,
      discount: data.discount,
      total: data.total,
      couponCode: data.coupon?.code,
      orderItems
    };

    const result = await ordersService.createOrder(payload);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pedido.' });
  }
};

// ========== ADMIN ==========
exports.getOrders = async (req, res) => {
  try {
    const orders = await ordersService.getOrders();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await ordersService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pedido.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await ordersService.updateOrderStatus(req.params.id, req.body.status);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar status.' });
  }
};

exports.printOrder = async (req, res) => {
  try {
    const output = await ordersService.printOrder(req.params.id);
    res.json({ success: true, output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar impressão.' });
  }
};
