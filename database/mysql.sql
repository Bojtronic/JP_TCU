CREATE TABLE proyectos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL COMMENT 'Tipos: imagen, audio, video, documento',
  archivo VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  tamanio INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  activo TINYINT(1) DEFAULT 1,
  CONSTRAINT chk_tipo CHECK (tipo IN ('imagen', 'audio', 'video', 'documento'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear índice para búsquedas por título
CREATE INDEX idx_proyectos_titulo ON proyectos(titulo);

-- Crear índice para filtrar por tipo
CREATE INDEX idx_proyectos_tipo ON proyectos(tipo);

