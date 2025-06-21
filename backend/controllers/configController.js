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
    res.status(500).json({ erro: 'Erro ao carregar configurações' });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { tituloSite, descricaoArtista, redesSociais, cores } = req.body;
    let fotoPerfil = req.body.fotoPerfil; // URL existente ou nova

    if (req.file) {
      // Upload da nova foto para o Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'portfolio-artista/perfil',
        allowed_formats: ['jpg', 'jpeg', 'png']
      });
      fotoPerfil = result.secure_url; // Atualiza com a nova URL do Cloudinary
    }

    const config = await Config.findOneAndUpdate(
      {},
      { tituloSite, fotoPerfil, descricaoArtista, redesSociais: redesSociais ? JSON.parse(redesSociais) : undefined, cores: cores ? JSON.parse(cores) : undefined },
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar configurações', detalhes: error.message });
  }
};