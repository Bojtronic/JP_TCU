const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const multer = require('multer');

// Configuración de Multer para manejo de imágenes
const upload = multer({ storage: multer.memoryStorage() });

// Rutas para eventos
router.get('/', eventoController.getAll); // Obtener todos los eventos
router.get('/calendario', eventoController.getByDateRange); // Eventos por rango de fechas
router.get('/proximos', eventoController.getUpcoming); // Próximos eventos
router.get('/:id', eventoController.getById); // Obtener un evento específico
router.post('/', upload.single('imagen'), eventoController.create); // Crear nuevo evento
router.put('/:id', upload.single('imagen'), eventoController.update); // Actualizar evento
router.delete('/:id', eventoController.delete); // Eliminar evento


module.exports = router;