const prisma = require('../prismaClient');

exports.getCategories = () => {
  return prisma.category.findMany({
    orderBy: { position: 'asc' },
    include: { products: true }
  });
};

exports.createCategory = (data) => {
  return prisma.category.create({
    data: {
      name: data.name,
      position: data.position ?? 999
    }
  });
};

exports.updateCategory = (id, data) => {
  return prisma.category.update({
    where: { id: Number(id) },
    data
  });
};

exports.deleteCategory = (id) => {
  return prisma.category.delete({
    where: { id: Number(id) }
  });
};

// === NOVO: mover categoria ===
exports.moveCategory = async (id, direction) => {
  const categories = await prisma.category.findMany({ orderBy: { position: 'asc' } });
  const index = categories.findIndex(c => c.id === Number(id));
  if (index === -1) throw new Error('Categoria não encontrada');

  let swapWithIndex = null;
  if (direction === 'up' && index > 0) swapWithIndex = index - 1;
  if (direction === 'down' && index < categories.length - 1) swapWithIndex = index + 1;
  if (swapWithIndex === null) return categories;

  const current = categories[index];
  const swapWith = categories[swapWithIndex];

  await prisma.$transaction([
    prisma.category.update({ where: { id: current.id }, data: { position: swapWith.position } }),
    prisma.category.update({ where: { id: swapWith.id }, data: { position: current.position } }),
  ]);

  return prisma.category.findMany({ orderBy: { position: 'asc' } });
};

exports.reorderCategories = async (order) => {
  const updates = order.map((item) =>
    prisma.category.update({
      where: { id: item.id },
      data: { position: item.position }
    })
  );
  return await prisma.$transaction(updates);
};
