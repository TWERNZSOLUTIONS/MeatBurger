const prisma = require('../prismaClient');

exports.getProducts = ({ categoryId, publicOnly } = {}) => {
  const where = {
    ...(categoryId && { categoryId: Number(categoryId) }),
    ...(publicOnly && { outOfStock: false })
  };

  return prisma.product.findMany({
    where,
    orderBy: { position: 'asc' },
    include: {
      category: true
      // 🔥 NÃO carregar flavors aqui (evita timeout)
    }
  });
};

exports.getProductById = (id) => {
  return prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      flavors: {
        where: { deletedAt: null },
        orderBy: { position: 'asc' }
      }
    }
  });
};

exports.createProduct = async (data) => {
  const { flavors, ...rest } = data;

  return prisma.product.create({
    data: {
      ...rest,
      ...(flavors && {
        flavors: {
          create: flavors
        }
      })
    }
  });
};

exports.updateProduct = async (id, data) => {
  const { flavors, ...rest } = data;

  return prisma.product.update({
    where: { id: Number(id) },
    data: {
      ...rest,
      ...(flavors && {
        flavors: {
          deleteMany: {},
          create: flavors
        }
      })
    }
  });
};

exports.toggleProductStock = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) }
  });

  if (!product) throw new Error('Produto não encontrado');

  return prisma.product.update({
    where: { id: Number(id) },
    data: { outOfStock: !product.outOfStock }
  });
};

exports.deleteProduct = (id) => {
  return prisma.product.delete({ where: { id: Number(id) } });
};

exports.moveProduct = async (id, direction) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) }
  });

  const products = await prisma.product.findMany({
    where: { categoryId: product.categoryId },
    orderBy: { position: 'asc' }
  });

  const index = products.findIndex(p => p.id === Number(id));
  const swapIndex =
    direction === 'up' ? index - 1 :
    direction === 'down' ? index + 1 : null;

  if (swapIndex < 0 || swapIndex >= products.length) return products;

  await prisma.$transaction([
    prisma.product.update({
      where: { id: products[index].id },
      data: { position: products[swapIndex].position }
    }),
    prisma.product.update({
      where: { id: products[swapIndex].id },
      data: { position: products[index].position }
    })
  ]);

  return prisma.product.findMany({
    where: { categoryId: product.categoryId },
    orderBy: { position: 'asc' }
  });
};
