const Config = require('../models/Config');
const cloudinary = require('cloudinary').v2;

exports.getConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar configurações', detalhes: error.message });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { tituloSite, descricaoArtista, redesSociais, cores } = req.body || {};
    let fotoPerfil = req.body.fotoPerfil || (await Config.findOne()).fotoPerfil;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio-artista/perfil',
        allowed_formats: ['jpg', 'jpeg', 'png'],
      }).catch(err => { throw new Error(`Falha no upload para Cloudinary: ${err.message}`); });
      fotoPerfil = result.secure_url;
    }

    const updateData = { fotoPerfil };
    if (tituloSite) updateData.tituloSite = tituloSite;
    if (descricaoArtista) updateData.descricaoArtista = descricaoArtista;
    if (redesSociais) {
      try {
        updateData.redesSociais = typeof redesSociais === 'string' ? JSON.parse(redesSociais) : redesSociais;
      } catch (e) {
        throw new Error('Dados de redes sociais inválidos');
      }
    }
    if (cores) {
      try {
        updateData.cores = typeof cores === 'string' ? JSON.parse(cores) : cores;
      } catch (e) {
        throw new Error('Dados de cores inválidos');
      }
    }

    const config = await Config.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar configurações', detalhes: error.message });
  }
};

exports.auth = async (req, res) => {
  try {
    console.log('Requisição de autenticação recebida:', req.body); // Log para depuração
    const { senha } = req.body;
    const config = await Config.findOne();
    if (config && config.senha === senha) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Senha inválida' });
    }
  } catch (error) {
    console.error('Erro no auth:', error.message);
    res.status(500).json({ erro: 'Erro ao autenticar', detalhes: error.message });
  }
};