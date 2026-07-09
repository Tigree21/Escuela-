const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  try {
    const student = db.get('SELECT id FROM estudiantes WHERE usuario_id = ?', [req.user.id]);
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const payments = db.all(
      `SELECT p.*, n.nombre as nivel_nombre
       FROM pagos p
       JOIN niveles n ON n.id = p.nivel
       WHERE p.estudiante_id = ?
       ORDER BY p.fecha_pago DESC`,
      [student.id]
    );

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener pagos' });
  }
});

router.post('/', authenticate, [
  body('nivel').isInt({ min: 1, max: 3 }).withMessage('Nivel inválido'),
  body('monto').isFloat({ min: 0 }).withMessage('Monto inválido'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nivel, monto, metodo_pago } = req.body;
    const student = db.get('SELECT id FROM estudiantes WHERE usuario_id = ?', [req.user.id]);

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const result = db.run(
      "INSERT INTO pagos (estudiante_id, nivel, monto, fecha_vencimiento, estado, metodo_pago) VALUES (?, ?, ?, date('now', '+30 days'), 'pendiente', ?)",
      [student.id, nivel, monto, metodo_pago || null]
    );

    const payment = db.get('SELECT * FROM pagos WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar pago' });
  }
});

module.exports = router;
