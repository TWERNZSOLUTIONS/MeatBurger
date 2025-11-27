const prisma = require('../prismaClient');

exports.getAddons = () => {
  return prisma.addon.findMany({
    orderBy: { position: 'asc' }
  });
};

exports.createAddon = (data) => {
  return prisma.addon.create({
    data: {
      name: data.name,
      price: data.price,
      position: data.position ?? 999
    }
  });
};

exports.updateAddon = (id, data) => {
  return prisma.addon.update({
    where: { id: Number(id) },
    data
  });
};

exports.deleteAddon = (id) => {
  return prisma.addon.delete({
    where: { id: Number(id) }
  });
};

exports.reorderAddons = async (order) => {
  const updates = order.map((item) =>
    prisma.addon.update({
      where: { id: item.id },
      data: { position: item.position }
    })
  );

  return await prisma.$transaction(updates);
};
