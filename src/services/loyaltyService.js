const prisma = require('../prismaClient');

// Listar cartões fidelidade
exports.getCards = () => {
  return prisma.loyaltyCard.findMany({
    orderBy: { id: 'desc' },
  });
};

// Registrar pedido do cliente (incrementa pedidos)
exports.recordPurchase = async ({ name, phone }) => {
  if (!name || !phone) throw new Error("Nome e telefone são obrigatórios.");

  // Procurar cartão pelo telefone
  let card = await prisma.loyaltyCard.findFirst({ where: { phone } });

  // Pegar programa ativo
  const program = await prisma.loyaltyProgram.findFirst({ where: { active: true } });
  if (!program) throw new Error("Nenhum programa de fidelidade ativo.");

  if (!card) {
    // Cria cartão novo
    card = await prisma.loyaltyCard.create({
      data: {
        name,
        phone,
        pedidos: 1,
        meta: program.requiredPurchases,
        status: "Não premiado",
        lembrete: null,
      },
    });
  } else {
    // Atualiza cartão existente
    const newPedidos = card.pedidos + 1;
    card = await prisma.loyaltyCard.update({
      where: { id: card.id },
      data: {
        pedidos: newPedidos,
        status: newPedidos >= card.meta ? "Premiado" : "Não premiado",
        lembrete: newPedidos >= card.meta ? "Meta atingida!" : null,
      },
    });
  }

  return card;
};

// Salvar/editar prêmio e meta
exports.setReward = async ({ reward, rewardTarget }) => {
  if (!reward || !rewardTarget) throw new Error("Brinde e meta obrigatórios.");

  const existing = await prisma.setting.findFirst({ where: { key: "loyaltyReward" } });

  if (existing) {
    return prisma.setting.update({
      where: { id: existing.id },
      data: { value: JSON.stringify({ reward, rewardTarget }) },
    });
  } else {
    return prisma.setting.create({
      data: { key: "loyaltyReward", value: JSON.stringify({ reward, rewardTarget }) },
    });
  }
};

// Buscar prêmio/meta atual
exports.getReward = async () => {
  const setting = await prisma.setting.findFirst({ where: { key: "loyaltyReward" } });
  if (!setting) return null;
  return JSON.parse(setting.value);
};
