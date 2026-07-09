const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticate, (req, res) => {
  try {
    const userId = req.user.id;

    const student = db.get(
      `SELECT e.*, u.nombre, u.correo, u.foto_url
       FROM estudiantes e
       JOIN users u ON u.id = e.usuario_id
       WHERE e.usuario_id = ?`,
      [userId]
    );

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const payments = db.all('SELECT * FROM pagos WHERE estudiante_id = ? ORDER BY fecha_pago DESC', [student.id]);
    const progress = db.all('SELECT * FROM progreso WHERE estudiante_id = ? ORDER BY nivel ASC', [student.id]);
    const messages = db.all('SELECT * FROM mensajes ORDER BY created_at DESC LIMIT 5');
    const nextPayment = db.get(
      'SELECT * FROM pagos WHERE estudiante_id = ? AND estado = ? ORDER BY fecha_vencimiento ASC LIMIT 1',
      [student.id, 'pendiente']
    );

    res.json({ student, payments, progress, messages, nextPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener datos del dashboard' });
  }
});

module.exports = router;
