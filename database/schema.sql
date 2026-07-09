-- Database schema for H.M.A.S Armonia Musical (SQLite)

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol TEXT DEFAULT 'estudiante' CHECK (rol IN ('administrador', 'estudiante')),
  foto_url TEXT DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS estudiantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  telefono TEXT DEFAULT NULL,
  fecha_nacimiento TEXT DEFAULT NULL,
  direccion TEXT DEFAULT NULL,
  fecha_inscripcion TEXT DEFAULT (date('now')),
  nivel_actual INTEGER DEFAULT 1 CHECK (nivel_actual BETWEEN 1 AND 10),
  porcentaje_progreso REAL DEFAULT 0,
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'graduado', 'suspendido', 'inactivo')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS niveles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  duracion_dias INTEGER NOT NULL DEFAULT 30,
  descripcion TEXT DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO niveles (id, nombre, duracion_dias, descripcion) VALUES
  (1, 'Nivel 1', 30, 'Fundamentos de la música, ritmo y notas básicas'),
  (2, 'Nivel 2', 30, 'Lectura de partituras y ejercicios rítmicos'),
  (3, 'Nivel 3', 30, 'Técnicas de mano derecha e izquierda'),
  (4, 'Nivel 4', 30, 'Escalas mayores y menores'),
  (5, 'Nivel 5', 30, 'Acordes básicos y progresiones armónicas'),
  (6, 'Nivel 6', 30, 'Técnicas avanzadas de interpretación'),
  (7, 'Nivel 7', 30, 'Improvisación y teoría musical'),
  (8, 'Nivel 8', 30, 'Composición y arreglos musicales'),
  (9, 'Nivel 9', 30, 'Presentación final y masterclass');

CREATE TABLE IF NOT EXISTS pagos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estudiante_id INTEGER NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
  nivel INTEGER NOT NULL CHECK (nivel BETWEEN 1 AND 9),
  monto REAL NOT NULL,
  fecha_pago TEXT DEFAULT (date('now')),
  fecha_vencimiento TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'vencido', 'cancelado')),
  comprobante_url TEXT DEFAULT NULL,
  metodo_pago TEXT DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS progreso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estudiante_id INTEGER NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
  nivel INTEGER NOT NULL CHECK (nivel BETWEEN 1 AND 9),
  porcentaje REAL DEFAULT 0,
  observaciones TEXT DEFAULT NULL,
  fecha_inicio TEXT NOT NULL,
  fecha_fin TEXT DEFAULT NULL,
  estado TEXT DEFAULT 'en_curso' CHECK (estado IN ('en_curso', 'completado', 'bloqueado')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mensajes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  tipo TEXT DEFAULT 'general' CHECK (tipo IN ('general', 'anuncio', 'recordatorio')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS asistencia (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estudiante_id INTEGER NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
  fecha TEXT NOT NULL,
  presente INTEGER DEFAULT 1,
  observaciones TEXT DEFAULT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(estudiante_id, fecha)
);

-- Run: node backend/seed.js para insertar datos de prueba
-- Admin: admin@armoniamusical.com / admin123
-- Demo:  demo@armoniamusical.com / demo123
