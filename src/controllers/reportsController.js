const reportsService = require('../services/reportsService');
const { Parser } = require('json2csv');

// Gera relatório de pedidos
exports.getOrdersReport = async (req, res) => {
  try {
    const { start, end, status } = req.query;
    const orders = await reportsService.getOrdersReport({ start, end, status });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Nenhum pedido encontrado para o período/filtro.' });
    }

    // Converte em CSV
    const fields = [
      'id', 'customerName', 'customerPhone', 'subtotal', 'discount', 'total',
      'status', 'createdAt', 'updatedAt', 'items'
    ];
    
    const ordersForCsv = orders.map(o => ({
      ...o,
      items: o.items.map(i => `${i.name} (x${i.quantity})`).join('; ')
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(ordersForCsv);

    res.header('Content-Type', 'text/csv');
    res.attachment(`relatorio_pedidos_${Date.now()}.csv`);
    return res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar relatório de pedidos.' });
  }
};
