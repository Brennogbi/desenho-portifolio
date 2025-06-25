const Imagem = require('../models/Imagem');
const cloudinary = require('cloudinary').v2;

exports.getImagens = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const categoria = req.query.categoria || '';
    const skip = (pagina - 1) * limite;

    const query = {};
    if (categoria) query.categoria = categoria;

    const imagens = await Imagem.find(query).skip(skip).limit(limite);
    const total = await Imagem.countDocuments(query);

    res.json({ imagens, total });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao carregar imagens', detalhes: error.message });
  }
};

exports.uploadImagem = async (req, res) => {
  try {
    const { titulo, descricao, categoria } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio-artista/imagens',
      allowed_formats: ['jpg', 'jpeg', 'png'],
    }).catch(err => { throw new Error(`Falha no upload para Cloudinary: ${err.message}`); });

    const imagem = new Imagem({
      titulo,
      descricao,
      url: result.secure_url,
      categoria,
    });
    await imagem.save();

    res.json(imagem);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao enviar imagem', detalhes: error.message });
  }
};

exports.deleteImagem = async (req, res) => {
  try {
    const imagem = await Imagem.findByIdAndDelete(req.params.id);
    if (!imagem) throw new Error('Imagem não encontrada');
    res.json({ mensagem: 'Imagem deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar imagem', detalhes: error.message });
  }
};