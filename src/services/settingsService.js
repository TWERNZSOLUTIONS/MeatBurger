const prisma = require('../prismaClient');

// Converte array [{key,value}] → objeto {key:value}
function formatSettings(rows) {
  const obj = {};
  rows.forEach(item => {
    let value = item.value;
    try {
      value = JSON.parse(item.value);
    } catch { /* mantém string se não for JSON */ }
    obj[item.key] = value;
  });

  // defaults
  return {
    storeStatus: obj.storeStatus || 'Aberta',
    info: obj.info || '',
    phone: obj.phone || '',
    address: obj.address || '',
    additionalInfo: obj.additionalInfo || '',
    daysOpen: obj.daysOpen || [],
    openHour: obj.openHour || '10:00',
    closeHour: obj.closeHour || '22:00',
    manualClosed: obj.manualClosed || false,
    manualCloseReason: obj.manualCloseReason || ''
  };
}

// Calcula se a loja está aberta, considerando fechamento após meia-noite
function isStoreOpen(settings) {
  if (settings.manualClosed) return false;

  const now = new Date();
  const dayNames = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const today = dayNames[now.getDay()];

  if (!settings.daysOpen.includes(today)) return false;

  let [openH, openM] = settings.openHour.split(":").map(Number);
  let [closeH, closeM] = settings.closeHour.split(":").map(Number);

  const openTime = new Date(now);
  openTime.setHours(openH, openM, 0, 0);

  let closeTime = new Date(now);
  closeTime.setHours(closeH, closeM, 0, 0);

  // Se o horário de fechamento for menor que o de abertura → passa da meia-noite
  if (closeTime <= openTime) {
    closeTime.setDate(closeTime.getDate() + 1);
  }

  return now >= openTime && now <= closeTime;
}

// PUBLIC + ADMIN
exports.getSettings = async () => {
  const rows = await prisma.setting.findMany();
  const settings = formatSettings(rows);
  settings.isOpen = isStoreOpen(settings);
  return settings;
};

// PUBLIC
exports.getSettingsPublic = async () => {
  const rows = await prisma.setting.findMany();
  const settings = formatSettings(rows);
  settings.isOpen = isStoreOpen(settings);
  return settings;
};

// ADMIN — atualizar key/value
exports.updateSettings = async (data) => {
  const updates = await Promise.all(
    Object.keys(data).map(async (key) => {
      let value = data[key];
      if (typeof value === "boolean") value = value ? "true" : "false";
      if (Array.isArray(value) || typeof value === "object") value = JSON.stringify(value);

      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    })
  );

  const settings = formatSettings(updates);
  settings.isOpen = isStoreOpen(settings);
  return settings;
};
