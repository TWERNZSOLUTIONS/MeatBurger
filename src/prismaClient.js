const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Adicionando a configuração SSL para o Render
  // Note: O Prisma geralmente lida com isso através da URL, mas esta é uma segurança extra
  // para ambientes como o Render que exigem SSL.
  log: ['query', 'info', 'warn', 'error'], // Opcional: para debug
  // A configuração SSL é geralmente feita na URL de conexão ou no ambiente de deploy.
  // Para o Render, a URL de conexão externa já deve ser suficiente.
  // No entanto, se o problema persistir, a configuração de conexão pode precisar ser ajustada.
  // Por enquanto, vamos confiar na URL de conexão e no ambiente.
  // Removendo a tentativa de configuração SSL manual aqui, pois o Prisma lida com isso.
  // Deixando o log para debug.
});

module.exports = prisma;
