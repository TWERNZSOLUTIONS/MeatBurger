const prisma = require('../prismaClient');

// =========================
// PRODUTOS
// =========================

exports.getProducts = async ({ categoryId, publicOnly = false }) => {
  const where = {};

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  /**
   * ATENÇÃO (decisão correta):
   * - Produto esgotado NÃO some
   * - Frontend decide se pode clicar ou não
   * - Backend apenas entrega o dado
   */
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

exports.getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      flavors: true,
    },
  });
};

// =========================
// ESGOTAR / ATIVAR
// =========================

exports.toggleProductStock = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    throw new Error('Produto não encontrado.');
  }

  return prisma.product.update({
    where: { id: Number(id) },
    data: {
      outOfStock: !product.outOfStock,
    },
  });
};

// =========================
// CRUD (mantido para compatibilidade)
// =========================

exports.createProduct = async (data) => {
  return prisma.product.create({
    data,
  });
};

exports.updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id: Number(id) },
    data,
  });
};

exports.deleteProduct = async (id) => {
  return prisma.product.delete({
    where: { id: Number(id) },
  });
};

// =========================
// ORDENAÇÃO
// =========================

exports.moveProduct = async (id, direction) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });

  if (!product) {
    throw new Error('Produto não encontrado.');
  }

  const offset = direction === 'up' ? -1 : 1;

  return prisma.product.update({
    where: { id: Number(id) },
    data: {
      position: product.position + offset,
    },
  });
};

// =========================
// SABORES
// =========================

exports.getFlavors = async (productId) => {
  return prisma.productFlavor.findMany({
    where: { productId: Number(productId) },
    orderBy: { position: 'asc' },
  });
};

exports.getFlavorById = async (id) => {
  return prisma.productFlavor.findUnique({
    where: { id: Number(id) },
  });
};

exports.createFlavor = async (data) => {
  return prisma.productFlavor.create({
    data,
  });
};

exports.updateFlavor = async (id, data) => {
  return prisma.productFlavor.update({
    where: { id: Number(id) },
    data,
  });
};

exports.deleteFlavor = async (id) => {
  return prisma.productFlavor.delete({
    where: { id: Number(id) },
  });
};
