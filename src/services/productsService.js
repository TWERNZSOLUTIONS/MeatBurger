const prisma = require('../prismaClient');

// =========================
// PRODUTOS
// =========================

exports.getProducts = async ({ categoryId, publicOnly = false }) => {
  const where = {};

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  if (publicOnly) {
    where.outOfStock = false;
  }

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

exports.createProduct = async (data) => {
  return prisma.product.create({ data });
};

exports.updateProduct = async (id, data) => {
  const productId = Number(id);

  // 🔥 AJUSTE CRÍTICO — separação correta
  const { flavors, image, price, categoryId, outOfStock, ...rest } = data;

  // 🔥 AJUSTE CRÍTICO — sanitização total
  const productData = {
    ...rest,
    ...(price !== undefined && { price: Number(price) }),
    ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
    ...(outOfStock !== undefined && { outOfStock: Boolean(outOfStock) }),
    ...(image !== undefined && image !== '' && { image }),
  };

  // 🔥 REMOVE qualquer undefined (Prisma odeia isso)
  Object.keys(productData).forEach(
    (key) => productData[key] === undefined && delete productData[key]
  );

  const product = await prisma.product.update({
    where: { id: productId },
    data: productData,
  });

  // =========================
  // SABORES (mantido)
  // =========================
  if (Array.isArray(flavors)) {
    await prisma.productFlavor.deleteMany({
      where: { productId },
    });

    for (const flavor of flavors) {
      await prisma.productFlavor.create({
        data: {
          productId,
          name: flavor.name,
          price: Number(flavor.price || 0),
        },
      });
    }
  }

  return product;
};

exports.deleteProduct = async (id) => {
  return prisma.product.delete({
    where: { id: Number(id) },
  });
};

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
  return prisma.productFlavor.create({ data });
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
