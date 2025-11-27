const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const auth = require('../middleware/auth');

// Rotas administrativas (com autenticação)
router.get('/cards', auth, loyaltyController.getCards);             // listar cartões fidelidade
router.post('/reward', auth, loyaltyController.setReward);         // cadastrar/editar prêmio e meta
router.get('/reward', auth, loyaltyController.getReward);        // Buscar prêmio/meta atual

// Rota pública: registrar pedido do cliente para fidelidade
router.post('/record', loyaltyController.recordPurchase);          // chamado pelo checkout

module.exports = router;
