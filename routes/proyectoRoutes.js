const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer (mejorada)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configuración completa de upload con límites y filtros
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'audio/wav'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, GIF) y audios (MP3, WAV)'));
    }
  }
});

// Middleware para manejar errores de Multer
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Error de Multer (ej: tamaño de archivo excedido)
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Otros errores (ej: tipo de archivo no permitido)
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Rutas para proyectos
router.get('/', proyectoController.getAll);
router.post('/', upload.single('archivo'), handleUploadErrors, proyectoController.create);
router.put('/:id', upload.single('archivo'), handleUploadErrors, proyectoController.update);
router.delete('/:id', proyectoController.delete);

module.exports = router;
