const express = require('express');
const db = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  try {
    const student = db.get('SELECT id FROM estudiantes WHERE usuario_id = ?', [req.user.id]);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

    const records = db.all(
      'SELECT * FROM asistencia WHERE estudiante_id = ? ORDER BY fecha DESC LIMIT 30',
      [student.id]
    );
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener asistencia' });
  }
});

router.post('/', authenticate, (req, res) => {
  try {
    const student = db.get('SELECT id FROM estudiantes WHERE usuario_id = ?', [req.user.id]);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

    const { fecha, presente } = req.body;
    if (!fecha) return res.status(400).json({ message: 'La fecha es obligatoria' });

    db.run(
      'INSERT OR REPLACE INTO asistencia (estudiante_id, fecha, presente) VALUES (?, ?, ?)',
      [student.id, fecha, presente !== undefined ? presente : 1]
    );
    res.status(201).json({ message: 'Asistencia registrada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar asistencia' });
  }
});

router.get('/stats', authenticate, (req, res) => {
  try {
    const student = db.get('SELECT id FROM estudiantes WHERE usuario_id = ?', [req.user.id]);
    if (!student) return res.status(404).json({ message: 'Estudiante no encontrado' });

    const total = db.get(
      "SELECT COUNT(*) as count FROM asistencia WHERE estudiante_id = ? AND fecha >= date('now', '-30 days')",
      [student.id]
    );
    const presentes = db.get(
      "SELECT COUNT(*) as count FROM asistencia WHERE estudiante_id = ? AND presente = 1 AND fecha >= date('now', '-30 days')",
      [student.id]
    );

    res.json({
      total: total.count,
      presentes: presentes.count,
      ausencias: total.count - presentes.count,
      porcentaje: total.count > 0 ? Math.round((presentes.count / total.count) * 100) : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadísticas de asistencia' });
  }
});

const adminRouter = express.Router();
adminRouter.use(authenticate, authorizeAdmin);

adminRouter.get('/', (req, res) => {
  try {
    const { estudiante_id } = req.query;
    let records;
    if (estudiante_id) {
      records = db.all(
        `SELECT a.*, u.nombre as estudiante_nombre
         FROM asistencia a
         JOIN estudiantes e ON e.id = a.estudiante_id
         JOIN users u ON u.id = e.usuario_id
         WHERE a.estudiante_id = ?
         ORDER BY a.fecha DESC LIMIT 30`,
        [estudiante_id]
      );
    } else {
      records = db.all(
        `SELECT a.*, u.nombre as estudiante_nombre
         FROM asistencia a
         JOIN estudiantes e ON e.id = a.estudiante_id
         JOIN users u ON u.id = e.usuario_id
         ORDER BY a.fecha DESC LIMIT 50`
      );
    }
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener asistencia' });
  }
});

adminRouter.post('/', (req, res) => {
  try {
    const { estudiante_id, fecha, presente, observaciones } = req.body;
    if (!estudiante_id || !fecha) return res.status(400).json({ message: 'Estudiante y fecha son obligatorios' });

    db.run(
      'INSERT OR REPLACE INTO asistencia (estudiante_id, fecha, presente, observaciones) VALUES (?, ?, ?, ?)',
      [estudiante_id, fecha, presente !== undefined ? presente : 1, observaciones || null]
    );
    res.status(201).json({ message: 'Asistencia registrada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar asistencia' });
  }
});

adminRouter.get('/stats/:id', (req, res) => {
  try {
    const total = db.get(
      "SELECT COUNT(*) as count FROM asistencia WHERE estudiante_id = ? AND fecha >= date('now', '-30 days')",
      [req.params.id]
    );
    const presentes = db.get(
      "SELECT COUNT(*) as count FROM asistencia WHERE estudiante_id = ? AND presente = 1 AND fecha >= date('now', '-30 days')",
      [req.params.id]
    );
    res.json({
      total: total.count,
      presentes: presentes.count,
      ausencias: total.count - presentes.count,
      porcentaje: total.count > 0 ? Math.round((presentes.count / total.count) * 100) : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

module.exports = { router, adminRouter };
