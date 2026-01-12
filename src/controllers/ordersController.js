const ordersService = require('../services/ordersService');

// =======================
// CRIAR PEDIDO (CLIENTE)
// =======================
exports.createOrder = async (req, res) => {
  try {
    const order = await ordersService.createOrder(req.body);
    return res.status(201).json(order);
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    return res.status(500).json({ error: 'Erro ao criar pedido' });
  }
};

// =======================
// LISTAR PEDIDOS (ADMIN)
// =======================
exports.getOrders = async (req, res) => {
  try {
    const orders = await ordersService.getOrders();
    return res.json(orders);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err);
    return res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
};

// =======================
// DETALHE DO PEDIDO
// =======================
exports.getOrderById = async (req, res) => {
  try {
    const order = await ordersService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    return res.json(order);
  } catch (err) {
    console.error('Erro ao buscar pedido:', err);
    return res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
};

// =======================
// ATUALIZAR STATUS
// =======================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await ordersService.updateOrderStatus(
      req.params.id,
      status
    );
    return res.json(order);
  } catch (err) {
    console.error('Erro ao atualizar status:', err);
    return res.status(500).json({ error: 'Erro ao atualizar status' });
  }
};

// =======================
// IMPRIMIR PEDIDO
// =======================
exports.printOrder = async (req, res) => {
  try {
    const printData = await ordersService.printOrder(req.params.id);
    if (!printData) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    return res.json(printData);
  } catch (err) {
    console.error('Erro ao imprimir pedido:', err);
    return res.status(500).json({ error: 'Erro ao imprimir pedido' });
  }
};
