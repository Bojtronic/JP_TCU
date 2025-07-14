const db = require('../database/db');

class EventoModel {
  // Obtener todos los eventos (datos básicos para listado)
  static async getAll() {
    const { rows } = await db.query(`
      SELECT id, titulo, descripcion, fecha, lugar, imagen 
      FROM eventos
      ORDER BY fecha DESC
    `);
    return rows;
  }

  // Obtener eventos por rango de fechas (para calendario)
  static async getByDateRange(startDate, endDate) {
  const { rows } = await db.query(
    `SELECT id, titulo, descripcion, fecha, lugar, imagen
     FROM eventos 
     WHERE fecha BETWEEN $1 AND $2
     ORDER BY fecha`,
    [startDate, endDate]
  );
  return rows;
}

  // Obtener un evento por ID (con todos los detalles)
  static async getById(id) {
    const { rows } = await db.query(
      `SELECT id, titulo, descripcion, fecha, lugar, imagen
       FROM eventos 
       WHERE id = $1`,
      [id]
    );
    return rows[0];
  }

  // Crear un nuevo evento
  static async create({ titulo, descripcion, fecha, lugar, imagen }) {
    const { rows } = await db.query(
      `INSERT INTO eventos 
       (titulo, descripcion, fecha, lugar, imagen)
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [titulo, descripcion, fecha, lugar, imagen]
    );
    return rows[0].id;
  }

  // Actualizar un evento
 static async update(id, { titulo, descripcion, fecha, lugar, imagen }) {
  const query = `
    UPDATE eventos 
    SET titulo = COALESCE($1, titulo),
        descripcion = COALESCE($2, descripcion),
        fecha = COALESCE($3, fecha),
        lugar = COALESCE($4, lugar),
        imagen = COALESCE($5, imagen)
    WHERE id = $6
  `;
  await db.query(query, [
    titulo, descripcion, fecha, lugar, imagen, id
  ]);
  return true;
}

  // Eliminar un evento
  static async delete(id) {
    await db.query('DELETE FROM eventos WHERE id = $1', [id]);
    return true;
  }

  // Método adicional para obtener eventos próximos
  static async getUpcomingEvents(limit = 5) {
    const { rows } = await db.query(
      `SELECT id, titulo, fecha, lugar 
       FROM eventos 
       WHERE fecha > NOW()
       ORDER BY fecha ASC
       LIMIT $1`,
      [limit]
    );
    return rows;
  }
}

module.exports = EventoModel;
