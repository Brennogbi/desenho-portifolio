const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
    }

    // Buscar usuário no banco
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
    }

    // Gerar JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(500).json({ erro: 'Erro ao realizar login', detalhes: error.message });
  }
};