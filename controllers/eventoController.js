const EventoModel = require('../models/eventoModel');

const eventoController = {
  getAll: async (req, res) => {
    try {
      const eventos = await EventoModel.getAll();
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const evento = await EventoModel.getById(req.params.id);
      if (!evento) {
        return res.status(404).json({ error: 'Evento no encontrado' });
      }
      res.json(evento);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar evento' });
    }
  },

  create: async (req, res) => {
    try {
      const { titulo, descripcion, fecha, lugar } = req.body;
      
      const id = await EventoModel.create({
        titulo,
        descripcion,
        fecha,
        lugar,
        imagen: req.file?.buffer // Usamos buffer directamente como BYTEA
      });
      
      res.status(201).json({ id });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear evento' });
    }
  },

  update: async (req, res) => {
    try {
      await EventoModel.update(req.params.id, {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        fecha: req.body.fecha,
        lugar: req.body.lugar,
        imagen: req.file?.buffer // Solo actualiza si se sube nueva imagen
      });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar evento' });
    }
  },

  delete: async (req, res) => {
    try {
      await EventoModel.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar evento' });
    }
  }
};

module.exports = eventoController;
