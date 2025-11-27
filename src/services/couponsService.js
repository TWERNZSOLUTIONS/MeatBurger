const prisma = require('../prismaClient');

// LISTAR (admin)
exports.getCoupons = () => {
  return prisma.coupon.findMany({ orderBy: { id: 'desc' } });
};

// BUSCAR POR CÓDIGO (public)
exports.findByCode = (code) => {
  return prisma.coupon.findFirst({
    where: {
      code: {
        equals: code,
        mode: 'insensitive' // aceita MAIÚSCULAS/minúsculas
      }
    }
  });
};

// CRIAR (admin)
exports.createCoupon = (data) => {
  return prisma.coupon.create({ data });
};

// ATUALIZAR (admin)
exports.updateCoupon = (id, data) => {
  return prisma.coupon.update({
    where: { id: Number(id) },
    data
  });
};

// DELETE (admin)
exports.deleteCoupon = (id) => {
  return prisma.coupon.delete({
    where: { id: Number(id) }
  });
};
