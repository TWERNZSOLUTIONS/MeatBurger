const prisma = require('../prismaClient');

exports.getProducts = ({ categoryId } = {}) => {
  const where = categoryId ? { categoryId: Number(categoryId) } : {};
  return prisma.product.findMany({
    where,
    orderBy: { position: 'asc' },
    include: { category: true }
  });
};

exports.getProductById = (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: { category: true }
  });
};

exports.createProduct = (data) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
      position: data.position
    }
  });
};

exports.updateProduct = async (id, data) => {
  const cleanData = {};

  for (const key in data) {
    if (data[key] !== undefined) {
      cleanData[key] = data[key];
    }
  }

  if (Object.keys(cleanData).length === 0) {
    return prisma.product.findUnique({ where: { id: Number(id) } });
  }

  return prisma.product.update({
    where: { id: Number(id) },
    data: cleanData
  });
};

exports.deleteProduct = (id) => {
  return prisma.product.delete({
    where: { id: Number(id) }
  });
};

// === MOVIMENTAÇÃO POR CATEGORIA ===
exports.moveProduct = async (id, direction) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) }
  });

  if (!product) throw new Error('Produto não encontrado');

  const products = await prisma.product.findMany({
    where: { categoryId: product.categoryId },
    orderBy: { position: 'asc' }
  });

  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) return products;

  const swapIndex =
    direction === 'up' ? index - 1 :
    direction === 'down' ? index + 1 :
    null;

  if (swapIndex < 0 || swapIndex >= products.length) {
    return products;
  }

  const current = products[index];
  const target = products[swapIndex];

  await prisma.$transaction([
    prisma.product.update({
      where: { id: current.id },
      data: { position: target.position }
    }),
    prisma.product.update({
      where: { id: target.id },
      data: { position: current.position }
    })
  ]);

  return prisma.product.findMany({
    where: { categoryId: product.categoryId },
    orderBy: { position: 'asc' }
  });
};

exports.reorderProducts = async (order) => {
  const updates = order.map(item =>
    prisma.product.update({
      where: { id: item.id },
      data: { position: item.position }
    })
  );
  return prisma.$transaction(updates);
};
