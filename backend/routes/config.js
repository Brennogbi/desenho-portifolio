const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { upload } = require('./imagens'); // Reutiliza o upload configurado em imagens.js

router.get('/', configController.getConfig);
router.put('/', upload.single('fotoPerfil'), configController.updateConfig);

module.exports = router;