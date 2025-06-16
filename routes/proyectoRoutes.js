const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const multer = require('multer');

// Configuración de Multer para manejar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(), // Almacena el archivo en memoria como Buffer
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
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Rutas para proyectos
router.get('/', proyectoController.getAll);
router.get('/:id', proyectoController.getById); 
router.post('/', 
  upload.single('archivo'), 
  handleUploadErrors, 
  proyectoController.create
);
router.put('/:id', 
  upload.single('archivo'), 
  handleUploadErrors, 
  proyectoController.update
);
router.delete('/:id', proyectoController.delete);

module.exports = router;