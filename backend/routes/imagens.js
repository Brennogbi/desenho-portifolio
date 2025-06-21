const express = require('express');
const router = express.Router();
const imagemController = require('../controllers/imagemController');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-artista',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('imagem'), imagemController.salvarImagem);
router.get('/', imagemController.listarImagens);
router.put('/:id', upload.single('imagem'), imagemController.editarImagem);
router.delete('/:id', imagemController.deletarImagem);

module.exports = router;