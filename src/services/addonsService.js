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

exports.toggleOutOfStock = async (id) => {
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
