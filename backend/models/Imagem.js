const mongoose = require('mongoose');

const imagemSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  url: { type: String, required: true },
  categoria: { type: String, required: true, enum: ['realismo', 'digital', 'animes'] }
}, { timestamps: true });

module.exports = mongoose.model('Imagem', imagemSchema);