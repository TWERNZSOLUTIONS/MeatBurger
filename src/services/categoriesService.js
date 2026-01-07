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
