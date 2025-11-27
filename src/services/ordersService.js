const prisma = require('../prismaClient');

exports.createOrder = async (data) => {
  if (!data.orderItems || !Array.isArray(data.orderItems)) {
    throw new Error("Itens do pedido inválidos");
  }

  return prisma.order.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      subtotal: data.subtotal,
      discount: data.discount ?? 0,
      total: data.total,
      status: data.status ?? "NEW",
      couponCode: data.couponCode || null,

      orderItems: {
        create: (data.orderItems || []).map(item => ({
          productId: item.productId ?? null,
          name: item.name,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          addons: {
            create: (item.addons || []).map(add => ({
              addonId: add.addonId ?? add.id ?? null,
              name: add.name,
              price: add.price
            }))
          }
        }))
      }

    },
    include: {
      orderItems: {
        include: { addons: true }
      }
    }
  });
};

exports.getOrders = () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { orderItems: { include: { addons: true } } }
  });
};

exports.getOrderById = (id) => {
  return prisma.order.findUnique({
    where: { id: Number(id) },
    include: { orderItems: { include: { addons: true } } }
  });
};

exports.updateOrderStatus = (id, status) => {
  return prisma.order.update({
    where: { id: Number(id) },
    data: { status }
  });
};

exports.printOrder = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { orderItems: { include: { addons: true } } }
  });

  return {
    printText: `PEDIDO #${order.id}\nTotal: R$ ${order.total}`
  };
};
