const prisma = require('../prismaClient');

exports.getProducts = async ({ categoryId, publicOnly = false }) => {
  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  return prisma.product.findMany({
    where,
    include: { flavors: true },
    orderBy: { position: 'asc' },
  });
};

exports.getProductById = async (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: { flavors: true },
  });
};

exports.toggleProductStock = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  if (!product) throw new Error('Produto não encontrado.');
  return prisma.product.update({
    where: { id: Number(id) },
    data: { outOfStock: !product.outOfStock },
  });
};

exports.createProduct = async (data) => prisma.product.create({ data });
exports.updateProduct = async (id, data) => prisma.product.update({ where: { id: Number(id) }, data });
exports.deleteProduct = async (id) => prisma.product.delete({ where: { id: Number(id) } });

exports.moveProduct = async (id, direction) => {
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) throw new Error('Produto não encontrado.');
  const offset = direction === 'up' ? -1 : 1;
  return prisma.product.update({ where: { id: Number(id) }, data: { position: product.position + offset } });
};

exports.getFlavors = async (productId) =>
  prisma.productFlavor.findMany({ where: { productId: Number(productId) }, orderBy: { position: 'asc' } });
exports.getFlavorById = async (id) => prisma.productFlavor.findUnique({ where: { id: Number(id) } });
exports.createFlavor = async (data) => prisma.productFlavor.create({ data });
exports.updateFlavor = async (id, data) => prisma.productFlavor.update({ where: { id: Number(id) }, data });
exports.deleteFlavor = async (id) => prisma.productFlavor.delete({ where: { id: Number(id) } });
