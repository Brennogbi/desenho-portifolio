const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, configController.getConfig);
router.put('/', authMiddleware, upload.single('fotoPerfil'), configController.updateConfig);

module.exports = router;