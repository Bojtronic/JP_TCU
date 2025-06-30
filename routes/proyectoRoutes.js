const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const multer = require('multer');

// Configuración básica de Multer
const upload = multer({ storage: multer.memoryStorage() });

// Rutas simplificadas
router.get('/', proyectoController.getAll);
router.get('/:id', proyectoController.getById);
router.post('/', upload.single('archivo'), proyectoController.create);
router.put('/:id', upload.single('archivo'), proyectoController.update);
router.delete('/:id', proyectoController.delete);

module.exports = router;
