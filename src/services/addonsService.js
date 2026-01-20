const prisma = require('../prismaClient');

// =========================
// ADDONS
// =========================
exports.getAddons = async ({ publicOnly = false } = {}) => {
  const where = {};

  if (publicOnly) where.outOfStock = false; // público não seleciona esgotado

  return prisma.addon.findMany({
    where,
    orderBy: { position: 'asc' }
  });
};

exports.createAddon = async ({ name, price, categoryId, outOfStock = false, position = 999 }) => {
  return prisma.addon.create({
    data: { name, price, categoryId, outOfStock, position }
  });
};

exports.updateAddon = async (id, { name, price, categoryId, position, outOfStock }) => {
  return prisma.addon.update({
    where: { id: Number(id) },
    data: { name, price, categoryId, position, outOfStock }
  });
};

// =========================
// ESGOTAR / ATIVAR
// =========================
exports.toggleAddonStock = async (id) => {
  const addon = await prisma.addon.findUnique({ where: { id: Number(id) }, select: { outOfStock: true } });
  if (!addon) throw new Error('Adicional não encontrado.');

  return prisma.addon.update({ where: { id: Number(id) }, data: { outOfStock: !addon.outOfStock } });
};

// =========================
// DELETE / REORDER
// =========================
exports.deleteAddon = async (id) => {
  return prisma.addon.delete({ where: { id: Number(id) } });
};

exports.reorderAddons = async (order = []) => {
  const updatePromises = order.map(item =>
    prisma.addon.update({ where: { id: Number(item.id) }, data: { position: Number(item.position) } })
  );
  await Promise.all(updatePromises);

  return exports.getAddons();
};
