const prisma = require('../prismaClient');

/**
 * Cria um pedido completo com itens e addons (quando existirem)
 */
exports.createOrder = async (data) => {
  if (!data.orderItems || !Array.isArray(data.orderItems)) {
    throw new Error('Itens do pedido inválidos');
  }

  return prisma.order.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      subtotal: data.subtotal,
      discount: data.discount ?? 0,
      total: data.total,
      status: data.status ?? 'NEW',
      couponCode: data.couponCode || null,

      orderItems: {
        create: data.orderItems.map(item => {
          const baseItem = {
            productId: item.productId ?? null,
            name: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.totalPrice
          };

          // Só cria addons se existirem
          if (item.addons && Array.isArray(item.addons) && item.addons.length > 0) {
            baseItem.addons = {
              create: item.addons.map(add => ({
                addonId: add.addonId ?? add.id,
                name: add.name,
                price: add.price
              }))
            };
          }

          return baseItem;
        })
      }
    },

    include: {
      orderItems: {
        include: {
          addons: true
        }
      }
    }
  });
};

/**
 * Lista todos os pedidos (admin)
 */
exports.getOrders = () => {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: { addons: true }
      }
    }
  });
};

/**
 * Busca pedido por ID (admin)
 */
exports.getOrderById = (id) => {
  return prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      orderItems: {
        include: { addons: true }
      }
    }
  });
};

/**
 * Atualiza status do pedido (admin)
 */
exports.updateOrderStatus = (id, status) => {
  return prisma.order.update({
    where: { id: Number(id) },
    data: { status }
  });
};

/**
 * Gera dados simples para impressão
 */
exports.printOrder = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      orderItems: {
        include: { addons: true }
      }
    }
  });

  return {
    printText: `PEDIDO #${order.id}\nTotal: R$ ${order.total}`
  };
};
