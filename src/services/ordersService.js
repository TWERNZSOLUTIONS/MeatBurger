const prisma = require('../prismaClient');

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function createOrder(data) {
  if (!Array.isArray(data.orderItems) || !data.orderItems.length) {
    throw new Error('Pedido sem itens');
  }

  const normalizedItems = data.orderItems.map(item => {
    const quantity = toNumber(item.quantity, 1);
    const unitPrice = toNumber(item.unitPrice, 0);

    return {
      productId: item.productId ?? null,
      name: item.name || 'Item',
      unitPrice,
      quantity,
      totalPrice: unitPrice * quantity,
      addons: Array.isArray(item.addons)
        ? item.addons.map(add => ({
            addonId: add.addonId ?? null,
            name: add.name || 'Adicional',
            price: toNumber(add.price, 0),
          }))
        : [],
    };
  });

  return prisma.$transaction(async tx => {
    return tx.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        subtotal: toNumber(data.subtotal),
        discount: toNumber(data.discount),
        total: toNumber(data.total),
        couponCode: data.couponCode,
        status: 'NEW',
        orderItems: {
          create: normalizedItems.map(item => ({
            productId: item.productId,
            name: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            addons: item.addons.length
              ? { create: item.addons }
              : undefined,
          })),
        },
      },
      include: {
        orderItems: { include: { addons: true } },
      },
    });
  });
}

const getOrders = () =>
  prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { orderItems: { include: { addons: true } } },
  });

const getOrderById = id =>
  prisma.order.findUnique({
    where: { id: Number(id) },
    include: { orderItems: { include: { addons: true } } },
  });

const updateOrderStatus = (id, status) =>
  prisma.order.update({
    where: { id: Number(id) },
    data: { status },
  });

const printOrder = async id => {
  const order = await getOrderById(id);
  if (!order) return null;

  return {
    printText: `PEDIDO #${order.id}\nTOTAL: R$ ${order.total.toFixed(2)}`,
  };
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  printOrder,
};
