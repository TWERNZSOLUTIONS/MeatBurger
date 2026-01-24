const prisma = require('../prismaClient');

exports.getAddons = async ({ publicOnly = false } = {}) => {
  const where = {};

  if (publicOnly) {
    where.outOfStock = false;
  }

  return prisma.addon.findMany({
    where,
    orderBy: { position: 'asc' },
  });
};

exports.toggleAddonStock = async (id) => {
  const addon = await prisma.addon.findUnique({
    where: { id: Number(id) },
  });

  if (!addon) {
    throw new Error('Adicional não encontrado.');
  }

  return prisma.addon.update({
    where: { id: Number(id) },
    data: { outOfStock: !addon.outOfStock },
  });
};

exports.createAddon = async (data) => {
  return prisma.addon.create({ data });
};

exports.updateAddon = async (id, data) => {
  const { price, categoryId, outOfStock, image, ...rest } = data;

  const addonData = {
    ...rest,
    ...(price !== undefined && { price: Number(price) }),
    ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
    ...(outOfStock !== undefined && { outOfStock: Boolean(outOfStock) }),
    ...(image !== undefined && image !== '' && { image }),
  };

  Object.keys(addonData).forEach(
    (key) => addonData[key] === undefined && delete addonData[key]
  );

  return prisma.addon.update({
    where: { id: Number(id) },
    data: addonData,
  });
};

exports.deleteAddon = async (id) => {
  return prisma.addon.delete({
    where: { id: Number(id) },
  });
};

exports.reorderAddons = async (order) => {
  const updates = [];

  for (const { id, position } of order) {
    updates.push(
      prisma.addon.update({
        where: { id: Number(id) },
        data: { position: Number(position) },
      })
    );
  }

  return Promise.all(updates);
};
