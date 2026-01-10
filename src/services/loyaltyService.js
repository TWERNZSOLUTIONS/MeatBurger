const prisma = require("../prismaClient");

exports.getCards = () => {
  return prisma.loyaltyCard.findMany({
    orderBy: { id: "desc" },
  });
};

exports.recordPurchase = async ({ name, phone }) => {
  if (!name || !phone) return;

  // Programa ativo (se não existir, ignora fidelidade)
  const program = await prisma.loyaltyProgram.findFirst({
    where: { active: true },
  });

  if (!program) {
    console.warn("Nenhum programa de fidelidade ativo.");
    return;
  }

  let card = await prisma.loyaltyCard.findFirst({ where: { phone } });

  if (!card) {
    await prisma.loyaltyCard.create({
      data: {
        name,
        phone,
        pedidos: 1,
        meta: program.requiredPurchases,
        status: "Não premiado",
      },
    });
    return;
  }

  const newPedidos = card.pedidos + 1;

  await prisma.loyaltyCard.update({
    where: { id: card.id },
    data: {
      pedidos: newPedidos,
      status: newPedidos >= card.meta ? "Premiado" : "Não premiado",
      lembrete: newPedidos >= card.meta ? "Meta atingida!" : null,
    },
  });
};

exports.setReward = async ({ reward, rewardTarget }) => {
  const existing = await prisma.setting.findFirst({
    where: { key: "loyaltyReward" },
  });

  const value = JSON.stringify({ reward, rewardTarget });

  if (existing) {
    return prisma.setting.update({
      where: { id: existing.id },
      data: { value },
    });
  }

  return prisma.setting.create({
    data: { key: "loyaltyReward", value },
  });
};

exports.getReward = async () => {
  const setting = await prisma.setting.findFirst({
    where: { key: "loyaltyReward" },
  });

  return setting ? JSON.parse(setting.value) : null;
};
