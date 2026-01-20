const prisma = require('../prismaClient');

// =========================
// PRODUTOS
// =========================

exports.getProducts = async ({ categoryId, publicOnly = false }) => {
  const where = {};

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  // ❌ REMOVIDO: isso fazia o produto SUMIR do cardápio público
  // if (publicOnly) {
  //   where.outOfStock = false;
  // }

  return prisma.product.findMany({
    where,
    include: {
      flavors: true,
    },
    orderBy: {
      position: 'asc',
    },
  });
};

exports.toggleOutOfStock = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  return prisma.product.update({
    where: { id: Number(id) },
    data: {
      outOfStock: !product.outOfStock,
    },
  });
};
