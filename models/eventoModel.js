const db = require('../database/db');

class EventoModel {
  // Obtener todos los eventos
  static async getAll() {
    const { rows } = await db.query(`
      SELECT id, titulo, descripcion, fecha, lugar, imagen
      FROM eventos
      ORDER BY fecha DESC
    `);
    return rows;
  }

  // Obtener un evento por ID
  static async getById(id) {
    const { rows } = await db.query(
      'SELECT * FROM eventos WHERE id = $1', 
      [id]
    );
    return rows[0];
  }

  // Crear evento (solo con los campos de tu tabla)
  static async create({ titulo, descripcion, fecha, lugar, imagen }) {
    const { rows } = await db.query(
      `INSERT INTO eventos (titulo, descripcion, fecha, lugar, imagen)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [titulo, descripcion, fecha, lugar, imagen]
    );
    return rows[0].id;
  }

  // Actualizar evento
  static async update(id, { titulo, descripcion, fecha, lugar, imagen }) {
    await db.query(
      `UPDATE eventos 
       SET titulo = $1, 
           descripcion = $2, 
           fecha = $3, 
           lugar = $4, 
           imagen = COALESCE($5, imagen)
       WHERE id = $6`,
      [titulo, descripcion, fecha, lugar, imagen, id]
    );
    return true;
  }

  // Eliminar evento
  static async delete(id) {
    await db.query('DELETE FROM eventos WHERE id = $1', [id]);
    return true;
  }
}

module.exports = EventoModel;
