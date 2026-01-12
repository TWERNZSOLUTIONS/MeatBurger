const prisma = require('../prisma');

exports.createOrder = async ({
  customerName,
  customerPhone,
  items,
  total,
  paymentMethod,
  observation,
}) => {
  return prisma.$transaction(async tx => {
    const order = await tx.order.create({
      data: {
        customerName,
        customerPhone,
        total,
        paymentMethod,
        observation,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            addons: {
              create: item.addons.map(add => ({
                addonId: add.addonId, // null para bebida/porção
                name: add.name,
                price: add.price,
              })),
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            addons: true,
          },
        },
      },
    });

    return order;
  });
};
