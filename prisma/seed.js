// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const username = 'MeatBurger';
  const email = 'meatburger.py@outlook.com';
  const password = 'Admin159*';

  // Checar se o admin já existe
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log('Admin já existe:', username);
    return;
  }

  // Hash da senha
  const passwordHash = await bcrypt.hash(password, 10);

  // Criar admin
  const admin = await prisma.adminUser.create({
    data: {
      username,
      email,
      passwordHash,
      role: 'admin',
    },
  });

  console.log('Admin criado com sucesso:', admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
