const db = require('../database/db');

class ProyectoModel {
  // Obtener todos los proyectos (solo datos básicos)
  static async getAll() {
    const { rows } = await db.query(`
    SELECT id, titulo, descripcion, tipo, archivo, mime_type
    FROM proyectos
  `);
    return rows;
  }

  // Obtener un proyecto por ID
  static async getById(id) {
    const { rows } = await db.query('SELECT * FROM proyectos WHERE id = $1', [id]);
    return rows[0];
  }

  // Crear proyecto (sin validación de Buffer)
  static async create({ titulo, descripcion, tipo, archivo, mime_type }) {
    const { rows } = await db.query(
      `INSERT INTO proyectos (titulo, descripcion, tipo, archivo, mime_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [titulo, descripcion, tipo, archivo, mime_type]
    );
    return rows[0].id;
  }

  // Actualizar proyecto (sin manejo de archivo existente)
  static async update(id, { titulo, descripcion, tipo, archivo, mime_type }) {
    await db.query(
      `UPDATE proyectos 
       SET titulo = $1, descripcion = $2, tipo = $3, archivo = $4, mime_type = $5
       WHERE id = $6`,
      [titulo, descripcion, tipo, archivo, mime_type, id]
    );
    return true;
  }

  // Eliminar proyecto
  static async delete(id) {
    await db.query('DELETE FROM proyectos WHERE id = $1', [id]);
    return true;
  }
}

module.exports = ProyectoModel;
