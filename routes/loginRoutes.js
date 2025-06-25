const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/login', loginController.login);
router.post('/register', loginController.register);

// Rutas protegidas (requieren autenticación)
router.get('/me', authMiddleware, loginController.getMe);

module.exports = router;

