const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Rutas públicas
//router.post('/login', loginController.login);
router.post('/register', loginController.register);
router.post('/', loginController.login);

module.exports = router;
