const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', eventoController.getAll);
router.get('/:id', eventoController.getById);
router.post('/', upload.single('imagen'), eventoController.create);
router.put('/:id', upload.single('imagen'), eventoController.update);
router.delete('/:id', eventoController.delete);

module.exports = router;