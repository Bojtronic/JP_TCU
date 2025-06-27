const LoginModel = require('../models/loginModel');

const loginController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
      }

      const usuario = await LoginModel.getByEmail(email);
      
      if (!usuario || usuario.clave !== password) { // Usa 'clave' en lugar de 'password' para coincidir con tu DB
        return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      res.json({ 
        success: true,
        user: { id: usuario.id, nombre: usuario.nombre, email: usuario.correo }
      });

    } catch (error) {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  register: async (req, res) => {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }

      const usuarioExistente = await LoginModel.getByEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }

      const nuevoUsuario = await LoginModel.create({
        nombre,
        correo: email, // Asegúrate de usar los nombres de campo de tu DB
        clave: password
      });

      res.status(201).json({
        success: true,
        user: { id: nuevoUsuario.id, nombre, email }
      });

    } catch (error) {
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }
};

module.exports = loginController;
