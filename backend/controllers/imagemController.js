const Imagem = require('../models/Imagem');

exports.salvarImagem = async (req, res) => {
  try {
    const { titulo, descricao, categoria } = req.body;
    const url = req.file.path;

    const novaImagem = await Imagem.create({
      titulo,
      descricao,
      categoria,
      url,
    });

    res.status(201).json(novaImagem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao salvar imagem' });
  }
};

exports.listarImagens = async (req, res) => {
  try {
    const { categoria, busca, pagina = 1, limite = 6 } = req.query;

    const filtro = {};
    if (categoria) filtro.categoria = categoria;
    if (busca) filtro.titulo = { $regex: busca, $options: 'i' };

    const imagens = await Imagem.find(filtro)
      .sort({ criadoEm: -1 })
      .skip((pagina - 1) * limite)
      .limit(parseInt(limite));

    const total = await Imagem.countDocuments(filtro);

    res.json({ imagens, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar imagens' });
  }
};

exports.editarImagem = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, categoria } = req.body;
    const url = req.file ? req.file.path : req.body.url; // Mantém URL existente se não houver novo arquivo

    const imagemAtualizada = await Imagem.findByIdAndUpdate(
      id,
      { titulo, descricao, categoria, url },
      { new: true }
    );
    if (!imagemAtualizada) return res.status(404).json({ erro: 'Imagem não encontrada' });
    res.json(imagemAtualizada);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao editar imagem' });
  }
};

exports.deletarImagem = async (req, res) => {
  try {
    const { id } = req.params;
    const imagem = await Imagem.findByIdAndDelete(id);
    if (!imagem) return res.status(404).json({ erro: 'Imagem não encontrada' });
    res.status(200).json({ mensagem: 'Imagem deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar imagem' });
  }
};