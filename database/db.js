const { Pool } = require('pg');

const pool = new Pool({
  //user: 'postgres',
  user: 'jp_tcu_db_user',   
  //host: 'localhost',
  host: 'dpg-d3b0jkruibrs73f3gnag-a',   
  //database: 'JP_TCU',
  database: 'jp_tcu_db_2k2q',
  //password: '12345',
  password: 'pgN4PHG0RBxH5lRLHHQ7RzMG0JgvVU5r',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};


/*

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'el_usuario',
  password: 'la_contraseña',
  database: 'nombre_de_la_base_de_datos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

*/