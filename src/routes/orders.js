const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/ordersController');

// CRIA PEDIDO
router.post('/', ordersController.createOrder);

// LISTA PEDIDOS ATIVOS
router.get('/', ordersController.getOrders);

// LISTA HISTÓRICO
router.get('/history', ordersController.getArchivedOrders);

// BUSCA PEDIDO POR ID
router.get('/:id', ordersController.getOrderById);

// ATUALIZA STATUS
router.patch('/:id/status', ordersController.updateOrderStatus);

// EXCLUI PEDIDO 🔥
router.delete('/:id', ordersController.deleteOrder);

// IMPRIMIR
router.get('/:id/print', ordersController.printOrder);

module.exports = router;
