const ProyectoModel = require('../models/proyectoModel');

const proyectoController = {
  // Obtener todos los proyectos
  getAll: async (req, res) => {
    try {
      const proyectos = await ProyectoModel.getAll();
      res.json(proyectos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo proyecto
  create: async (req, res) => {
    try {
      const { titulo, descripcion, tipo } = req.body;
      
      // El archivo se maneja diferente porque viene como multipart/form-data
      const archivo = req.file ? `/uploads/${req.file.filename}` : null;
      
      if (!titulo || !descripcion || !tipo || !archivo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const nuevoProyecto = await ProyectoModel.create({
        titulo,
        descripcion,
        tipo,
        archivo
      });

      res.status(201).json(nuevoProyecto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un proyecto
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, descripcion, tipo } = req.body;
      const archivo = req.file ? `/uploads/${req.file.filename}` : null;

      // Obtener el proyecto actual para mantener el archivo si no se sube uno nuevo
      const proyectoActual = await ProyectoModel.getById(id);
      const archivoFinal = archivo || proyectoActual.archivo;

      const proyectoActualizado = await ProyectoModel.update(id, {
        titulo,
        descripcion,
        tipo,
        archivo: archivoFinal
      });

      res.json(proyectoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un proyecto
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await ProyectoModel.delete(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = proyectoController;

