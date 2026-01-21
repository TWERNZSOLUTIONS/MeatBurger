const prisma = require('../prismaClient');

exports.getProducts = async ({ categoryId, publicOnly = false } = {}) => {
  const where = {};
  if (categoryId) where.categoryId = Number(categoryId);
  if (publicOnly) where.outOfStock = false;
  return prisma.product.findMany({ where, orderBy: { position: 'asc' } });
};

exports.getProductById = async (id) => {
  return prisma.product.findUnique({ where: { id: Number(id) } });
};

exports.createProduct = async (data) => {
  const { flavors, ...rest } = data;
  const product = await prisma.product.create({ data: rest });
  if (flavors?.length) {
    await Promise.all(flavors.map(f =>
      prisma.productFlavor.create({ data: { ...f, productId: product.id } })
    ));
  }
  return product;
};

exports.updateProduct = async (id, data) => {
  const { flavors, ...rest } = data;
  const product = await prisma.product.update({ where: { id: Number(id) }, data: rest });
  if (flavors) {
    await prisma.productFlavor.deleteMany({ where: { productId: product.id } });
    await Promise.all(flavors.map(f =>
      prisma.productFlavor.create({ data: { ...f, productId: product.id } })
    ));
  }
  return product;
};

exports.toggleProductStock = async (id) => {
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) throw new Error('Produto não encontrado.');
  return prisma.product.update({ where: { id: Number(id) }, data: { outOfStock: !product.outOfStock } });
};

exports.deleteProduct = async (id) => prisma.product.delete({ where: { id: Number(id) } });

exports.moveProduct = async (id, direction) => {
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product) throw new Error('Produto não encontrado.');
  const swapProduct = await prisma.product.findFirst({
    where: { categoryId: product.categoryId, position: direction === 'up' ? { lt: product.position } : { gt: product.position } },
    orderBy: { position: direction === 'up' ? 'desc' : 'asc' }
  });
  if (!swapProduct) return product;
  await prisma.product.update({ where: { id: swapProduct.id }, data: { position: product.position } });
  return prisma.product.update({ where: { id: product.id }, data: { position: swapProduct.position } });
};

exports.getFlavors = async (productId) => prisma.productFlavor.findMany({ where: { productId: Number(productId) }, orderBy: { position: 'asc' } });
exports.getFlavorById = async (id) => prisma.productFlavor.findUnique({ where: { id: Number(id) } });

exports.createFlavor = async (data) => prisma.productFlavor.create({ data });
exports.updateFlavor = async (id, data) => prisma.productFlavor.update({ where: { id: Number(id) }, data });
exports.deleteFlavor = async (id) => prisma.productFlavor.delete({ where: { id: Number(id) } });
