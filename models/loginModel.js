const db = require('../database/db');

class LoginModel {
  // Obtener usuario por correo
  static async getByEmail(correo) {
    const { rows } = await db.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );
    return rows[0];
  }

  // Obtener usuario por ID
  static async getById(id) {
    const { rows } = await db.query(
      'SELECT id, nombre, correo FROM usuarios WHERE id = $1',
      [id]
    );
    return rows[0];
  }

  // Crear nuevo usuario
  static async create({ nombre, correo, clave }) {
    const { rows } = await db.query(
      `INSERT INTO usuarios (nombre, correo, clave)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, correo`,
      [nombre, correo, clave]
    );
    return rows[0];
  }

  // Actualizar última conexión (opcional)
  static async updateLastLogin(id) {
    await db.query(
      'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }
}

module.exports = LoginModel;
