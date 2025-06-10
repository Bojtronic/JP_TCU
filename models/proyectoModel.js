const db = require('../database/db');

class ProyectoModel {
  // Obtener todos los proyectos
  static async getAll() {
    // PostgreSQL:
    const { rows } = await db.query('SELECT * FROM proyectos ORDER BY id DESC');
    return rows;
    
    // MySQL:
    // const [rows] = await db.query('SELECT * FROM proyectos ORDER BY id DESC');
    // return rows;
  }

  // Obtener un proyecto por ID
  static async getById(id) {
    // PostgreSQL:
    const { rows } = await db.query('SELECT * FROM proyectos WHERE id = $1', [id]);
    return rows[0];
    
    // MySQL:
    // const [rows] = await db.query('SELECT * FROM proyectos WHERE id = ?', [id]);
    // return rows[0];
  }

  // Crear un nuevo proyecto
  static async create({ titulo, descripcion, tipo, archivo }) {
    // PostgreSQL:
    const { rows } = await db.query(
      'INSERT INTO proyectos (titulo, descripcion, tipo, archivo) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, descripcion, tipo, archivo]
    );
    return rows[0];
    
    // MySQL:
    // const [result] = await db.query(
    //   'INSERT INTO proyectos (titulo, descripcion, tipo, archivo) VALUES (?, ?, ?, ?)',
    //   [titulo, descripcion, tipo, archivo]
    // );
    // return this.getById(result.insertId);
  }

  // Actualizar un proyecto
  static async update(id, { titulo, descripcion, tipo, archivo }) {
    // PostgreSQL:
    const { rows } = await db.query(
      'UPDATE proyectos SET titulo = $1, descripcion = $2, tipo = $3, archivo = $4 WHERE id = $5 RETURNING *',
      [titulo, descripcion, tipo, archivo, id]
    );
    return rows[0];
    
    // MySQL:
    // await db.query(
    //   'UPDATE proyectos SET titulo = ?, descripcion = ?, tipo = ?, archivo = ? WHERE id = ?',
    //   [titulo, descripcion, tipo, archivo, id]
    // );
    // return this.getById(id);
  }

  // Eliminar un proyecto
  static async delete(id) {
    // PostgreSQL/MySQL:
    await db.query('DELETE FROM proyectos WHERE id = $1', [id]);
    // MySQL usar '?' en lugar de '$1'
    return true;
  }
}

module.exports = ProyectoModel;

