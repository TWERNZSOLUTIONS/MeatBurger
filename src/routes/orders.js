const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const auth = require('../middleware/auth');

// --- ROTAS PÚBLICAS (cliente) ---
router.post('/', ordersController.createOrder); // criar pedido

// --- ROTAS ADMIN (protegidas) ---
router.get('/', auth, ordersController.getOrders); // listar todos os pedidos
router.get('/:id', auth, ordersController.getOrderById); // detalhe de um pedido
router.patch('/:id/status', auth, ordersController.updateOrderStatus); // atualizar status
router.get('/:id/print', auth, ordersController.printOrder); // impressão do pedido

module.exports = router;
