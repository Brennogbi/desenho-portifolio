const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  tituloSite: { type: String, default: 'Bem vindo ao meu PORTFÓLIO!' },
  descricaoArtista: { type: String, default: 'Sou Breno, artista visual apaixonado por retratos, paisagens e arte digital.' },
  redesSociais: {
    instagram: String,
    youtube: String,
    whatsapp: String
  },
  fotoPerfil: { type: String, default: 'img/logo.jpg' },
  cores: {
    background: { type: String, default: '#000' },
    text: { type: String, default: '#fff' },
    accent: { type: String, default: '#fff' }
  }
});

module.exports = mongoose.model('Config', configSchema);