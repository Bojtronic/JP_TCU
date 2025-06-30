const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  //user: 'jp_tcu_bd_user',   
  host: 'localhost',
  //host: 'dpg-d1fc55je5dus73fr5fpg-a',   // .oregon-postgres.render.com/jp_tcu_bd   
  database: 'JP_TCU',
  //database: 'jp_tcu_bd',
  password: '12345',
  //password: 'mmZr25WbHBMuDbROwYeWcMREL6Umv38A',
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