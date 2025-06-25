const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const LoginModel = require('../models/loginModel');
const { JWT_SECRET } = require('../config/config');

const loginController = {
  // Autenticar usuario
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      // Buscar usuario
      const usuario = await LoginModel.getByEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const passwordMatch = await bcrypt.compare(password, usuario.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      // Excluir password en la respuesta
      const { password: _, ...userWithoutPassword } = usuario;

      res.json({
        user: userWithoutPassword,
        token
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Registrar nuevo usuario
  register: async (req, res) => {
    try {
      const { nombre, email, password, rol = 'user' } = req.body;

      // Validación
      if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }

      // Verificar si el usuario ya existe
      const existingUser = await LoginModel.getByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const newUser = await LoginModel.create({
        nombre,
        email,
        password: hashedPassword,
        rol
      });

      // Generar token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, rol: newUser.rol },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.status(201).json({
        user: { id: newUser.id, nombre, email, rol },
        token
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener información del usuario actual
  getMe: async (req, res) => {
    try {
      // El middleware de autenticación ya verificó el token y adjuntó el usuario
      const user = req.user;
      
      // Obtener datos actualizados
      const currentUser = await LoginModel.getById(user.id);
      if (!currentUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Excluir password en la respuesta
      const { password, ...userWithoutPassword } = currentUser;

      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = loginController;

