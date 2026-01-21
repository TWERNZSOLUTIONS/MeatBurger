const prisma = require('../prismaClient');

// =========================
// ADICIONAIS
// =========================

exports.getAddons = async ({ publicOnly = false } = {}) => {
  const where = {};

  // ❌ REMOVIDO: isso fazia adicional SUMIR da página pública
  // if (publicOnly) {
  //   where.outOfStock = false;
  // }

  return prisma.addon.findMany({
    where,
    orderBy: {
      position: 'asc',
    },
  });
};

// 🔥 AJUSTE: renomeado para coincidir com o controller
exports.toggleAddonStock = async (id) => {
  const addon = await prisma.addon.findUnique({
    where: { id: Number(id) },
  });

  return prisma.addon.update({
    where: { id: Number(id) },
    data: {
      outOfStock: !addon.outOfStock,
    },
  });
};

// =========================
// CRUD
// =========================
exports.createAddon = async (data) => {
  return prisma.addon.create({
    data,
  });
};

exports.updateAddon = async (id, data) => {
  return prisma.addon.update({
    where: { id: Number(id) },
    data,
  });
};

exports.deleteAddon = async (id) => {
  return prisma.addon.delete({
    where: { id: Number(id) },
  });
};

// =========================
// REORDENAÇÃO
// =========================
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
