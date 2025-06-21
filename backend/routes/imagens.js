const express = require('express');
const router = express.Router();
const imagemController = require('../controllers/imagemController');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('imagem'), imagemController.salvarImagem);
router.get('/', imagemController.listarImagens);
router.put('/:id', upload.single('imagem'), imagemController.editarImagem);
router.delete('/:id', imagemController.deletarImagem);

module.exports = router;