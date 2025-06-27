const db = require('../database/db');

class LoginModel {
  static async getByEmail(correo) {
    const { rows } = await db.query(
      'SELECT id, nombre, correo, clave FROM usuarios WHERE correo = $1',
      [correo]
    );
    return rows[0];
  }

  static async create({ nombre, correo, clave }) {
    const { rows } = await db.query(
      `INSERT INTO usuarios (nombre, correo, clave)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, correo`,
      [nombre, correo, clave]
    );
    return rows[0];
  }
}

module.exports = LoginModel;
