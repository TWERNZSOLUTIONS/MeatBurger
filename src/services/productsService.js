const prisma = require('../prismaClient');

// =========================
// PRODUTOS
// =========================

exports.getProducts = async ({ categoryId, publicOnly = false }) => {
  const where = {
    deletedAt: null
  };

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  if (publicOnly) {
    where.outOfStock = false;
  }

  return prisma.product.findMany({
    where,
    orderBy: { position: 'asc' },
    include: {
      flavors: {
        where: { deletedAt: null },
        orderBy: { position: 'asc' }
      }
    }
  });
};

exports.getProductById = async (id) => {
  return prisma.product.findFirst({
    where: {
      id: Number(id),
      deletedAt: null
    },
    include: {
      flavors: {
        where: { deletedAt: null },
        orderBy: { position: 'asc' }
      }
    }
  });
};

exports.createProduct = async (data) => {
  const { flavors = [], ...productData } = data;

  return prisma.product.create({
    data: {
      ...productData,
      flavors: {
        create: flavors
      }
    },
    include: {
      flavors: true
    }
  });
};

exports.updateProduct = async (id, data) => {
  const { flavors, ...productData } = data;

  const productId = Number(id);

  if (flavors) {
    await prisma.productFlavor.deleteMany({
      where: { productId }
    });
  }

  return prisma.product.update({
    where: { id: productId },
    data: {
      ...productData,
      ...(flavors && {
        flavors: {
          create: flavors
        }
      })
    },
    include: {
      flavors: true
    }
  });
};

// =========================
// ESGOTAR / REATIVAR (CORRIGIDO)
// =========================
exports.toggleProductStock = async (id) => {
  const productId = Number(id);

  if (isNaN(productId)) {
    throw new Error('ID do produto inválido.');
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || product.deletedAt) {
    throw new Error('Produto não encontrado.');
  }

  return prisma.product.update({
    where: { id: productId },
    data: {
      outOfStock: !product.outOfStock
    }
  });
};

// =========================
// OUTROS
// =========================
exports.deleteProduct = async (id) => {
  return prisma.product.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() }
  });
};

exports.moveProduct = async (id, direction) => {
  const productId = Number(id);

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) throw new Error('Produto não encontrado.');

  const newPosition =
    direction === 'up' ? product.position - 1 : product.position + 1;

  return prisma.product.update({
    where: { id: productId },
    data: { position: newPosition }
  });
};

// =========================
// SABORES
// =========================
exports.getFlavors = async (productId) => {
  return prisma.productFlavor.findMany({
    where: {
      productId: Number(productId),
      deletedAt: null
    },
    orderBy: { position: 'asc' }
  });
};

exports.getFlavorById = async (id) => {
  return prisma.productFlavor.findFirst({
    where: {
      id: Number(id),
      deletedAt: null
    }
  });
};

exports.createFlavor = async (data) => {
  return prisma.productFlavor.create({ data });
};

exports.updateFlavor = async (id, data) => {
  return prisma.productFlavor.update({
    where: { id: Number(id) },
    data
  });
};

exports.deleteFlavor = async (id) => {
  return prisma.productFlavor.update({
    where: { id: Number(id) },
    data: { deletedAt: new Date() }
  });
};
