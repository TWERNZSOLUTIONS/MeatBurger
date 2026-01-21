const prisma = require('../prismaClient');

exports.getAddons = async ({ publicOnly = false } = {}) => {
  const where = {};
  return prisma.addon.findMany({ where, orderBy: { position: 'asc' } });
};

exports.toggleAddonStock = async (id) => {
  const addon = await prisma.addon.findUnique({ where: { id: Number(id) } });
  if (!addon) throw new Error('Adicional não encontrado.');
  return prisma.addon.update({ where: { id: Number(id) }, data: { outOfStock: !addon.outOfStock } });
};

exports.createAddon = async (data) => prisma.addon.create({ data });
exports.updateAddon = async (id, data) => prisma.addon.update({ where: { id: Number(id) }, data });
exports.deleteAddon = async (id) => prisma.addon.delete({ where: { id: Number(id) } });

exports.reorderAddons = async (order) => {
  const updates = [];
  for (const { id, position } of order) {
    updates.push(prisma.addon.update({ where: { id: Number(id) }, data: { position: Number(position) } }));
  }
  return Promise.all(updates);
};
