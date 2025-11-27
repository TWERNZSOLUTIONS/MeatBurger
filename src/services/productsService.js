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
      description: data.description || "",
      price: data.price,
      imageUrl: data.imageUrl || "",
      categoryId: data.categoryId,
      position: data.position ?? 999
    }
  });
};

exports.updateProduct = async (id, data) => {
  const cleanData = {};

  // Copiar somente dados válidos
  for (const key in data) {
    const value = data[key];

    if (value === undefined) continue;
    if (typeof value === "number" && isNaN(value)) continue;

    cleanData[key] = value;
  }

  // Se NADA foi enviado, simplesmente retorna o produto sem atualizar
  if (Object.keys(cleanData).length === 0) {
    return prisma.product.findUnique({
      where: { id: Number(id) }
    });
  }

  // Se há dados válidos, atualiza
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

// Mover produto
exports.moveProduct = async (id, direction) => {
  const products = await prisma.product.findMany({ orderBy: { position: 'asc' } });
  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) throw new Error('Produto não encontrado');

  let swapWithIndex = null;
  if (direction === 'up' && index > 0) swapWithIndex = index - 1;
  if (direction === 'down' && index < products.length - 1) swapWithIndex = index + 1;
  if (swapWithIndex === null) return products;

  const current = products[index];
  const swapWith = products[swapWithIndex];

  await prisma.$transaction([
    prisma.product.update({ where: { id: current.id }, data: { position: swapWith.position } }),
    prisma.product.update({ where: { id: swapWith.id }, data: { position: current.position } }),
  ]);

  return prisma.product.findMany({ orderBy: { position: 'asc' } });
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
