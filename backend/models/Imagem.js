// backend/models/Imagem.js
const mongoose = require('mongoose');

const imagemSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  categoria: String,
  url: String,
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Imagem', imagemSchema);
