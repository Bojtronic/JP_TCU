const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Rutas para proyectos
router.get('/', proyectoController.getAll);
router.post('/', upload.single('archivo'), proyectoController.create);
router.put('/:id', upload.single('archivo'), proyectoController.update);
router.delete('/:id', proyectoController.delete);

module.exports = router;
