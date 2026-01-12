const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/ordersController');

// CRIA PEDIDO
router.post('/', ordersController.createOrder);

// LISTA PEDIDOS
router.get('/', ordersController.getOrders);

// BUSCA PEDIDO POR ID
router.get('/:id', ordersController.getOrderById);

// ATUALIZA STATUS
router.patch('/:id/status', ordersController.updateOrderStatus);

// IMPRIMIR
router.get('/:id/print', ordersController.printOrder);

module.exports = router;
