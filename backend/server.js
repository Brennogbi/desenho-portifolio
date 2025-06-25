const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const imagemRoutes = require('./routes/imagens');
const configRoutes = require('./routes/config');
const authRoutes = require('./routes/auth');
app.use('/api/imagens', imagemRoutes);
app.use('/api/config', configRoutes);
app.use('/api', authRoutes);

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no MongoDB:', err);
  });

// Script inicial para criar usuário (opcional)
async function createInitialUser() {
  const User = require('./models/User');
  const bcrypt = require('bcrypt');
  const existingUser = await User.findOne({ email: 'admin@example.com' });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('senha123', 10);
    const user = new User({ email: 'admin@example.com', password: hashedPassword });
    await user.save();
    console.log('Usuário inicial criado');
  }
}

createInitialUser().catch(console.error);