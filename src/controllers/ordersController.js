const ordersService = require('../services/ordersService');

async function createOrder(req, res) {
  try {
    const data = req.body || {};

    const orderItems = Array.isArray(data.items)
      ? data.items.map(item => {
          const quantity = Number(item.qty) > 0 ? Number(item.qty) : 1;
          const unitPrice = Number(item.price) || 0;

          return {
            productId: item.productId ?? null,
            name: item.name || 'Item',
            unitPrice,
            quantity,
            totalPrice: unitPrice * quantity,

            addons: Array.isArray(item.addons)
              ? item.addons.map(add => {
                  /**
                   * REGRA DEFINITIVA:
                   * - Só envia addonId se for Addon real
                   * - Bebida / Porção (produto) → addonId = null
                   */
                  const isRealAddon =
                    typeof add.id === 'number' &&
                    add.type !== 'PRODUCT';

                  return {
                    addonId: isRealAddon ? add.id : null,
                    name: add.name || 'Adicional',
                    price: Number(add.price) || 0,
                  };
                })
              : [],
          };
        })
      : [];

    if (!orderItems.length) {
      return res.status(400).json({ error: 'Pedido sem itens' });
    }

    const payload = {
      customerName: data.customer?.name || null,
      customerPhone: data.customer?.phone || null,
      subtotal: Number(data.subtotal) || 0,
      discount: Number(data.discount) || 0,
      total: Number(data.total) || 0,
      couponCode: data.coupon?.code || null,
      orderItems,
    };

    const order = await ordersService.createOrder(payload);
    return res.status(201).json(order);
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    return res.status(500).json({ error: 'Erro ao criar pedido' });
  }
}

async function getOrders(req, res) {
  try {
    const orders = await ordersService.getOrders();
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await ordersService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const order = await ordersService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar status' });
  }
}

async function printOrder(req, res) {
  try {
    const result = await ordersService.printOrder(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao imprimir pedido' });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  printOrder,
};
