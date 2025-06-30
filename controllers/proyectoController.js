const ProyectoModel = require('../models/proyectoModel');

const proyectoController = {
  getAll: async (req, res) => {
    try {
      const proyectos = await ProyectoModel.getAll();
      res.json(proyectos); // Devuelve el array completo de proyectos
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const proyecto = await ProyectoModel.getById(req.params.id);
      proyecto ? res.json(proyecto) : res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar proyecto' });
    }
  },

  create: async (req, res) => {
    try {
      const { titulo, descripcion, tipo } = req.body;
      const id = await ProyectoModel.create({
        titulo,
        descripcion,
        tipo,
        archivo: req.file.buffer,
        mime_type: req.file.mimetype
      });
      res.status(201).json({ id });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear proyecto' });
    }
  },

  update: async (req, res) => {
    try {
      await ProyectoModel.update(req.params.id, {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        tipo: req.body.tipo,
        archivo: req.file?.buffer,
        mime_type: req.file?.mimetype
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar' });
    }
  },

  delete: async (req, res) => {
    try {
      await ProyectoModel.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar' });
    }
  }
};

module.exports = proyectoController;
