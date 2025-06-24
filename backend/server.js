const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({ origin: 'https://seu-frontend.onrender.com' })); // Ajuste o origin para o domínio do frontend
app.use(express.json());

// Rotas
const imagemRoutes = require('./routes/imagens');
const configRoutes = require('./routes/config');
app.use('/api/imagens', imagemRoutes);
app.use('/api/config', configRoutes);

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => { // Escuta em 0.0.0.0 para Render
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no MongoDB:', err);
  });