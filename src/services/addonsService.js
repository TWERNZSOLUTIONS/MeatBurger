const prisma = require('../prismaClient');

/**
 * LISTA ADICIONAIS (CARDÁPIO / ADICIONAIS PAGE)
 * → Retorna TODOS, mas ordenados
 * → O frontend decide se bloqueia clique quando isActive = false
 */
exports.getAddons = () => {
  return prisma.addon.findMany({
    orderBy: { position: 'asc' }
  });
};

/**
 * CRIA ADICIONAL
 * → Adicional nasce ativo por padrão
 */
exports.createAddon = (data) => {
  return prisma.addon.create({
    data: {
      name: data.name,
      price: data.price,
      position: data.position ?? 999,
      isActive: true
    }
  });
};

/**
 * ATUALIZA ADICIONAL
 * → Usado para editar nome, preço, posição ou ESGOTAR (isActive)
 */
exports.updateAddon = (id, data) => {
  return prisma.addon.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      price: data.price,
      position: data.position,
      isActive: data.isActive
    }
  });
};

/**
 * EXCLUI ADICIONAL
 */
exports.deleteAddon = (id) => {
  return prisma.addon.delete({
    where: { id: Number(id) }
  });
};

/**
 * REORDENA ADICIONAIS
 */
exports.reorderAddons = async (order) => {
  const updates = order.map((item) =>
    prisma.addon.update({
      where: { id: item.id },
      data: { position: item.position }
    })
  );

  return prisma.$transaction(updates);
};
