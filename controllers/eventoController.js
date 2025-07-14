const EventoModel = require('../models/eventoModel');

const eventoController = {
  // Obtener todos los eventos (para listado)
  getAll: async (req, res) => {
    try {
      const eventos = await EventoModel.getAll();
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener eventos' });
    }
  },

  // Obtener eventos por rango de fechas (para calendario)
  getByDateRange: async (req, res) => {
    try {
      const { start, end } = req.query;
      if (!start || !end) {
        return res.status(400).json({ error: 'Se requieren fechas de inicio y fin' });
      }
      
      const eventos = await EventoModel.getByDateRange(start, end);
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener eventos por fecha' });
    }
  },

  // Obtener un evento específico por ID
  getById: async (req, res) => {
    try {
      const evento = await EventoModel.getById(req.params.id);
      evento 
        ? res.json(evento) 
        : res.status(404).json({ error: 'Evento no encontrado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar evento' });
    }
  },

  // Crear un nuevo evento
  create: async (req, res) => {
    try {
        const { titulo, descripcion, fecha, hora, lugar } = req.body;
        
        if (!titulo || !descripcion || !fecha || !lugar) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const fechaHora = new Date(`${fecha}T${hora || '00:00:00'}`);
        
        const id = await EventoModel.create({
        titulo,
        descripcion,
        fecha: fechaHora,
        lugar,
        imagen: req.file?.buffer
        });
        
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear evento: ' + error.message });
    }
    },

    //Actualizar un evento existente
    update: async (req, res) => {
    try {
        const { titulo, descripcion, fecha, hora, lugar } = req.body;
        let fechaHora = null;
        
        if (fecha) {
        fechaHora = new Date(`${fecha}T${hora || '00:00:00'}`);
        }

        await EventoModel.update(req.params.id, {
        titulo,
        descripcion,
        fecha: fechaHora,
        lugar,
        imagen: req.file?.buffer
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar evento' });
    }
    },

  // Eliminar un evento
  delete: async (req, res) => {
    try {
      await EventoModel.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar evento' });
    }
  },

  // Obtener próximos eventos (para página principal)
  getUpcoming: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const eventos = await EventoModel.getUpcomingEvents(limit);
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener próximos eventos' });
    }
  }
};

module.exports = eventoController;