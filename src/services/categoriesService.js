const prisma = require('../prismaClient');

exports.getCategories = () => {
  return prisma.category.findMany({
    orderBy: { position: 'asc' },
    include: {
      products: {
        orderBy: { position: 'asc' }
      }
    }
  });
};

exports.createCategory = (data) => {
  if (!data.name) {
    throw new Error('Nome da categoria é obrigatório');
  }

  return prisma.category.create({
    data: {
      name: data.name.trim(),
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

exports.moveCategory = async (id, direction) => {
  let categories = await prisma.category.findMany({
    orderBy: { position: 'asc' }
  });

  categories = categories.map((c, i) => ({ ...c, position: i + 1 }));

  const index = categories.findIndex(c => c.id === Number(id));
  if (index === -1) throw new Error('Categoria não encontrada');

  const swapIndex =
    direction === 'up' ? index - 1 :
    direction === 'down' ? index + 1 :
    null;

  if (swapIndex === null || swapIndex < 0 || swapIndex >= categories.length) {
    return categories;
  }

  const current = categories[index];
  const target = categories[swapIndex];

  await prisma.$transaction([
    prisma.category.update({
      where: { id: current.id },
      data: { position: target.position }
    }),
    prisma.category.update({
      where: { id: target.id },
      data: { position: current.position }
    })
  ]);

  return prisma.category.findMany({ orderBy: { position: 'asc' } });
};

exports.reorderCategories = (order) => {
  return prisma.$transaction(
    order.map(item =>
      prisma.category.update({
        where: { id: item.id },
        data: { position: item.position }
      })
    )
  );
};
