CREATE TABLE proyectos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('imagen', 'audio', 'video', 'documento')),
  archivo VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  tamanio INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT TRUE
);

-- Crear índice para búsquedas por título
CREATE INDEX idx_proyectos_titulo ON proyectos(titulo);

-- Crear índice para filtrar por tipo
CREATE INDEX idx_proyectos_tipo ON proyectos(tipo);

-- Trigger para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON proyectos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
