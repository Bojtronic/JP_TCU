CREATE TABLE proyectos (
  id SERIAL PRIMARY KEY, 
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo VARCHAR(6) NOT NULL CHECK (tipo IN ('imagen', 'audio')), 
  archivo BYTEA NOT NULL, 
  mime_type VARCHAR(30) NOT NULL
);


CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  correo VARCHAR(50) UNIQUE NOT NULL,
  clave VARCHAR(20) NOT NULL
);