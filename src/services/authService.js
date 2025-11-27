const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (username, password) => {
  const admin = await prisma.adminUser.findUnique({
    where: { username }
  });

  if (!admin) throw new Error("Usuário não encontrado.");

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw new Error("Senha incorreta.");

  const token = jwt.sign(
    { id: admin.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username
    }
  };
};
