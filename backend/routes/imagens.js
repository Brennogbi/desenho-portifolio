const express = require('express');
const router = express.Router();
const imagemController = require('../controllers/imagemController');
const upload = require('../middleware/upload');

router.get('/', imagemController.getImagens);
router.post('/upload', upload.single('imagem'), imagemController.uploadImagem);
router.delete('/:id', imagemController.deleteImagem);

module.exports = router;