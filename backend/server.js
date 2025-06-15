// backend/server.js
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
app.use('/api/imagens', imagemRoutes);

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no MongoDB:', err);
  });
