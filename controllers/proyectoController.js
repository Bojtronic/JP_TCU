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

  // Obtener un proyecto por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const proyecto = await ProyectoModel.getById(id);
      
      if (!proyecto) {
        return res.status(404).json({ error: 'Proyecto no encontrado' });
      }
      
      res.json(proyecto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo proyecto (con archivo binario)
  create: async (req, res) => {
    try {
      const { titulo, descripcion, tipo } = req.body;
      const archivo = req.file.buffer; // Acceso al Buffer del archivo
      const mime_type = req.file.mimetype;

      // Validación básica
      if (!titulo || !descripcion || !tipo || !archivo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      await ProyectoModel.create({
        titulo,
        descripcion,
        tipo,
        archivo,
        mime_type
      });

      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un proyecto (con archivo binario)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, descripcion, tipo } = req.body;
      
      // Manejo del archivo (usar el nuevo si se subió, mantener el actual si no)
      let archivo, mime_type;
      if (req.file) {
        archivo = req.file.buffer;
        mime_type = req.file.mimetype;
      } else {
        const proyectoActual = await ProyectoModel.getById(id);
        archivo = proyectoActual.archivo;
        mime_type = proyectoActual.mime_type;
      }

      const actualizado = await ProyectoModel.update(id, {
        titulo,
        descripcion,
        tipo,
        archivo,
        mime_type
      });

      if (!actualizado) {
        return res.status(404).json({ error: 'Proyecto no encontrado' });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un proyecto
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const eliminado = await ProyectoModel.delete(id);
      
      if (!eliminado) {
        return res.status(404).json({ error: 'Proyecto no encontrado' });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = proyectoController;