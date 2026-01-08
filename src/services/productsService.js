const prisma = require('../prismaClient');

// ================= ADMIN =================
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
      description: data.description || "",
      price: data.price,
      imageUrl: data.imageUrl || "",
      categoryId: data.categoryId,
      position: data.position ?? 999,
      outOfStock: false
    }
  });
};

exports.updateProduct = async (id, data) => {
  const cleanData = {};

  for (const key in data) {
    const value = data[key];
    if (value === undefined) continue;
    if (typeof value === "number" && isNaN(value)) continue;
    cleanData[key] = value;
  }

  if (Object.keys(cleanData).length === 0) {
    return prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true }
    });
  }

  return prisma.product.update({
    where: { id: Number(id) },
    data: cleanData,
    include: { category: true }
  });
};

exports.toggleOutOfStock = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) }
  });

  if (!product) throw new Error("Produto não encontrado");

  return prisma.product.update({
    where: { id: Number(id) },
    data: {
      outOfStock: !product.outOfStock
    }
  });
};

exports.deleteProduct = (id) => {
  return prisma.product.delete({
    where: { id: Number(id) }
  });
};

// ================= CARDÁPIO =================
exports.getPublicProducts = ({ categoryId } = {}) => {
  const where = {
    outOfStock: false
  };

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  return prisma.product.findMany({
    where,
    orderBy: [
      { category: { position: 'asc' } },
      { position: 'asc' }
    ],
    include: { category: true }
  });
};

exports.getPublicProductById = (id) => {
  return prisma.product.findFirst({
    where: {
      id: Number(id),
      outOfStock: false
    },
    include: { category: true }
  });
};

// ================= MOVIMENTAÇÃO =================
exports.moveProduct = async (id, direction) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) }
  });

  if (!product) throw new Error('Produto não encontrado');

  let products = await prisma.product.findMany({
    where: { categoryId: product.categoryId },
    orderBy: { position: 'asc' }
  });

  products = products.map((p, idx) => ({ ...p, position: idx + 1 }));

  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) return products;

  let swapWithIndex = null;
  if (direction === 'up' && index > 0) swapWithIndex = index - 1;
  if (direction === 'down' && index < products.length - 1) swapWithIndex = index + 1;
  if (swapWithIndex === null) return products;

  const current = products[index];
  const swapWith = products[swapWithIndex];

  await prisma.$transaction([
    prisma.product.update({
      where: { id: current.id },
      data: { position: swapWith.position }
    }),
    prisma.product.update({
      where: { id: swapWith.id },
      data: { position: current.position }
    })
  ]);

  return prisma.product.findMany({
    where: { categoryId: product.categoryId },
    orderBy: { position: 'asc' }
  });
};
