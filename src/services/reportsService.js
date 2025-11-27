const prisma = require('../prismaClient');

exports.getOrdersReport = async ({ start, end, status }) => {
  const where = {};

  if (start || end) where.createdAt = {};
  if (start) where.createdAt.gte = new Date(start);
  if (end) where.createdAt.lte = new Date(end);
  if (status) where.status = status.toUpperCase();

  return prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: true
    }
  });
};
