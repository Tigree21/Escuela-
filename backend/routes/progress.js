const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  try {
    const student = db.get('SELECT id FROM estudiantes WHERE usuario_id = ?', [req.user.id]);
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const progress = db.all(
      `SELECT p.*, n.nombre as nivel_nombre, n.descripcion
       FROM progreso p
       JOIN niveles n ON n.id = p.nivel
       WHERE p.estudiante_id = ?
       ORDER BY p.nivel ASC`,
      [student.id]
    );

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener progreso' });
  }
});

module.exports = router;
