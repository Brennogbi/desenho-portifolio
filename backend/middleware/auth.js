const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    if (!token) {
      return res.status(401).json({ erro: 'Token de autenticação não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error.message);
    res.status(401).json({ erro: 'Token inválido ou expirado', detalhes: error.message });
  }
};

module.exports = authMiddleware;