const db = require('../database/db');

class ProyectoModel {
  // Obtener todos los proyectos (completos)
  static async getAll() {
    const { rows } = await db.query(`
      SELECT id, titulo, descripcion, tipo, archivo, mime_type
      FROM proyectos 
    `);
    return rows;
  }

  // Obtener un proyecto por id 
  static async getById(id) {
    const { rows } = await db.query(`
      SELECT id, titulo, descripcion, tipo, archivo, mime_type
      FROM proyectos 
      WHERE id = $1`, [id]);
    return rows[0];
  }

  // Crear un nuevo proyecto con archivo binario
  static async create({ titulo, descripcion, tipo, archivo, mime_type }) {
    if (!Buffer.isBuffer(archivo)) {
      throw new Error('El archivo debe ser un Buffer válido');
    }

    await db.query(
      `INSERT INTO proyectos 
       (titulo, descripcion, tipo, archivo, mime_type) 
       VALUES ($1, $2, $3, $4, $5)`, 
      [titulo, descripcion, tipo, archivo, mime_type]
    );
    return true; // Simple confirmación
  }

  // Actualizar TODOS los campos
  static async update(id, { titulo, descripcion, tipo, archivo, mime_type }) {
    if (!Buffer.isBuffer(archivo)) {
      throw new Error('El archivo debe ser un Buffer válido');
    }

    const { rowCount } = await db.query(
      `UPDATE proyectos 
       SET titulo = $1, descripcion = $2, tipo = $3, 
           archivo = $4, mime_type = $5
       WHERE id = $6`, 
      [titulo, descripcion, tipo, archivo, mime_type, id]
    );
    return rowCount > 0; 
  }

  // Eliminar un proyecto 
  static async delete(id) {
    const { rowCount } = await db.query(
      'DELETE FROM proyectos WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  }
}

module.exports = ProyectoModel;