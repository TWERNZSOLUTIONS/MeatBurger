const authService = require('../services/authService');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Usuário e senha são obrigatórios." });
    }

    const result = await authService.login(username, password);

    return res.json(result);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({ error: error.message });
  }
};
