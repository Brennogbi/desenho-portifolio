const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const upload = require('../middleware/upload');

router.get('/', configController.getConfig);
router.put('/', upload.single('fotoPerfil'), configController.updateConfig);
router.post('/auth', configController.auth); // Nova rota para autenticação

module.exports = router;