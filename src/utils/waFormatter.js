const prisma = require('../prismaClient');

exports.formatOrderText = async (orderId) => {
const order = await prisma.order.findUnique({ where: { id: orderId }, include: { orderItems: { include: { addons: true } } } });
let lines = [];
lines.push(`Pedido #${order.id}`);
if (order.customerName) lines.push(`Cliente: ${order.customerName}`);
if (order.customerPhone) lines.push(`Telefone: ${order.customerPhone}`);
lines.push('---');
order.orderItems.forEach(it => {
lines.push(`${it.quantity}x ${it.name} - R$${it.totalPrice.toFixed(2)}`);
if (it.addons && it.addons.length) {
it.addons.forEach(a => lines.push(` + ${a.name} - R$${a.price.toFixed(2)}`));
}
});
lines.push('---');
lines.push(`Subtotal: R$${order.subtotal.toFixed(2)}`);
if (order.discount && order.discount > 0) lines.push(`Desconto: R$${order.discount.toFixed(2)}`);
lines.push(`Total: R$${order.total.toFixed(2)}`);
if (order.notes) lines.push(`Obs: ${order.notes}`);
return lines.join('\n');
};