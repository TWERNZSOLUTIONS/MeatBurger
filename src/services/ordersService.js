const prisma = require('../prismaClient');

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

exports.createOrder = async (data) => {
  if (!Array.isArray(data.orderItems) || data.orderItems.length === 0) {
    throw new Error('Pedido sem itens');
  }

  // Normalização defensiva
  const normalizedItems = data.orderItems.map(item => {
    const quantity = toNumber(item.quantity, 1);
    const unitPrice = toNumber(item.unitPrice, 0);
    const totalPrice = unitPrice * quantity;

    return {
      productId: item.productId ?? null,
      name: item.name || 'Item',
      unitPrice,
      quantity,
      totalPrice,
      addons: Array.isArray(item.addons)
        ? item.addons.map(add => ({
            addonId: add.addonId ?? null,
            name: add.name || 'Adicional',
            price: toNumber(add.price, 0)
          }))
        : []
    };
  });

  const subtotal = toNumber(data.subtotal);
  const discount = toNumber(data.discount);
  const total = toNumber(data.total);

  try {
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerName: data.customerName || null,
          customerPhone: data.customerPhone || null,
          subtotal,
          discount,
          total,
          status: 'NEW',
          couponCode: data.couponCode || null,

          orderItems: {
            create: normalizedItems.map(item => ({
              productId: item.productId,
              name: item.name,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,

              addons: item.addons.length
                ? {
                    create: item.addons.map(add => ({
                      addonId: add.addonId,
                      name: add.name,
                      price: add.price
                    }))
                  }
                : undefined
            }))
          }
        },
        include: {
          orderItems: {
            include: { addons: true }
          }
        }
      });

      return order;
    });
  } catch (err) {
    console.error('❌ ERRO REAL AO CRIAR PEDIDO:', err);
    throw err;
  }
};

exports.getOrders = () =>
  prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: { include: { addons: true } }
    }
  });

exports.getOrderById = (id) =>
  prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      orderItems: { include: { addons: true } }
    }
  });

exports.updateOrderStatus = (id, status) =>
  prisma.order.update({
    where: { id: Number(id) },
    data: { status }
  });

exports.printOrder = async (id) => {
  const order = await exports.getOrderById(id);
  if (!order) return null;

  return {
    printText: `PEDIDO #${order.id}\nTOTAL: R$ ${order.total.toFixed(2)}`
  };
};
