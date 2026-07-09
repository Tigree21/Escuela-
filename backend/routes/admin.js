const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, authorizeAdmin);

router.get('/students', (req, res) => {
  try {
    const students = db.all(
      `SELECT u.id, u.nombre, u.correo, u.foto_url, u.created_at as usuario_creado,
              e.id as estudiante_id, e.telefono, e.fecha_inscripcion, e.nivel_actual,
              e.porcentaje_progreso, e.estado, e.fecha_nacimiento, e.direccion
       FROM users u
       JOIN estudiantes e ON e.usuario_id = u.id
       WHERE u.rol = 'estudiante'
       ORDER BY e.fecha_inscripcion DESC`
    );
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estudiantes' });
  }
});

router.post('/students', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('correo').isEmail().withMessage('Correo inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, correo, password, telefono, direccion, fecha_nacimiento } = req.body;

    const existingUser = db.get('SELECT * FROM users WHERE correo = ?', [correo]);
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = db.run(
      'INSERT INTO users (nombre, correo, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashedPassword, 'estudiante']
    );

    const studentId = result.lastInsertRowid;

    db.run(
      "INSERT INTO estudiantes (usuario_id, telefono, direccion, fecha_nacimiento, fecha_inscripcion, nivel_actual, porcentaje_progreso, estado) VALUES (?, ?, ?, ?, date('now'), 1, 0, 'activo')",
      [studentId, telefono || null, direccion || null, fecha_nacimiento || null]
    );

    const studentRec = db.get('SELECT id FROM estudiantes WHERE usuario_id = ?', [studentId]);

    db.run(
      "INSERT INTO progreso (estudiante_id, nivel, porcentaje, fecha_inicio, estado) VALUES (?, 1, 0, date('now'), 'en_curso')",
      [studentRec.id]
    );

    db.run(
      "INSERT INTO pagos (estudiante_id, nivel, monto, fecha_vencimiento, estado) VALUES (?, 1, 51, date('now', '+30 days'), 'pagado')",
      [studentRec.id]
    );

    res.status(201).json({ message: 'Estudiante creado correctamente con pago inicial' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear estudiante' });
  }
});

router.put('/students/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, telefono, direccion, fecha_nacimiento, estado, nivel_actual } = req.body;

    if (nombre || correo) {
      const updates = [];
      const values = [];
      if (nombre) { updates.push('nombre = ?'); values.push(nombre); }
      if (correo) { updates.push('correo = ?'); values.push(correo); }
      values.push(id);
      db.run(`UPDATE users SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = ?`, values);
    }

    const studentUpdates = [];
    const studentValues = [];
    if (telefono !== undefined) { studentUpdates.push('telefono = ?'); studentValues.push(telefono); }
    if (direccion !== undefined) { studentUpdates.push('direccion = ?'); studentValues.push(direccion); }
    if (fecha_nacimiento !== undefined) { studentUpdates.push('fecha_nacimiento = ?'); studentValues.push(fecha_nacimiento); }
    if (estado) { studentUpdates.push('estado = ?'); studentValues.push(estado); }
    if (nivel_actual !== undefined) { studentUpdates.push('nivel_actual = ?'); studentValues.push(nivel_actual); }

    if (studentUpdates.length > 0) {
      studentValues.push(id);
      db.run(
        `UPDATE estudiantes SET ${studentUpdates.join(', ')}, updated_at = datetime('now') WHERE usuario_id = ?`,
        studentValues
      );
    }

    res.json({ message: 'Estudiante actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar estudiante' });
  }
});

router.delete('/students/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ? AND rol = ?', [id, 'estudiante']);
    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar estudiante' });
  }
});

router.get('/payments', (req, res) => {
  try {
    const payments = db.all(
      `SELECT p.*, u.nombre as estudiante_nombre, u.correo as estudiante_correo,
              n.nombre as nivel_nombre
       FROM pagos p
       JOIN estudiantes e ON e.id = p.estudiante_id
       JOIN users u ON u.id = e.usuario_id
       JOIN niveles n ON n.id = p.nivel
       ORDER BY p.fecha_pago DESC`
    );
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener pagos' });
  }
});

router.put('/payments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    db.run("UPDATE pagos SET estado = ?, updated_at = datetime('now') WHERE id = ?", [estado, id]);
    const payment = db.get('SELECT * FROM pagos WHERE id = ?', [id]);

    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    if (estado === 'pagado') {
      const pctPerLevel = 100 / 9;
      const newProgress = Math.round(payment.nivel * pctPerLevel * 100) / 100;
      const newLevel = payment.nivel + 1;

      db.run(
        `UPDATE estudiantes
         SET nivel_actual = ?,
             porcentaje_progreso = ?,
             estado = CASE WHEN ? > 9 THEN 'graduado' ELSE estado END
         WHERE id = ?`,
        [newLevel, newProgress, payment.nivel, payment.estudiante_id]
      );

      db.run(
        "UPDATE progreso SET estado = 'completado', fecha_fin = date('now') WHERE estudiante_id = ? AND nivel = ?",
        [payment.estudiante_id, payment.nivel]
      );

      if (payment.nivel < 9) {
        const existingNext = db.get(
          'SELECT id FROM progreso WHERE estudiante_id = ? AND nivel = ?',
          [payment.estudiante_id, payment.nivel + 1]
        );
        if (!existingNext) {
          db.run(
            "INSERT INTO progreso (estudiante_id, nivel, porcentaje, fecha_inicio, estado) VALUES (?, ?, 0, date('now', '+1 day'), 'en_curso')",
            [payment.estudiante_id, payment.nivel + 1]
          );
        }
      }
    }

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar pago' });
  }
});

router.get('/stats', (req, res) => {
  try {
    const totalStudents = db.get('SELECT COUNT(*) as count FROM estudiantes');
    const activeStudents = db.get("SELECT COUNT(*) as count FROM estudiantes WHERE estado = 'activo'");
    const graduatedStudents = db.get("SELECT COUNT(*) as count FROM estudiantes WHERE estado = 'graduado'");
    const totalPayments = db.get("SELECT COUNT(*) as count, COALESCE(SUM(monto), 0) as total FROM pagos WHERE estado = 'pagado'");
    const pendingPayments = db.get("SELECT COUNT(*) as count FROM pagos WHERE estado = 'pendiente'");
    const overduePayments = db.get("SELECT COUNT(*) as count FROM pagos WHERE estado = 'vencido'");
    const studentsByLevel = db.all('SELECT nivel_actual, COUNT(*) as count FROM estudiantes GROUP BY nivel_actual ORDER BY nivel_actual');
    const recentPayments = db.all(
      `SELECT p.fecha_pago, COUNT(*) as cantidad, SUM(p.monto) as total
       FROM pagos p
       WHERE p.estado = 'pagado' AND p.fecha_pago >= date('now', '-30 days')
       GROUP BY p.fecha_pago ORDER BY p.fecha_pago DESC`
    );
    const monthlyRevenue = db.all(
      `SELECT strftime('%Y-%m-01', fecha_pago) as mes, SUM(monto) as total
       FROM pagos WHERE estado = 'pagado'
       GROUP BY mes ORDER BY mes DESC LIMIT 6`
    );

    res.json({
      totalStudents: totalStudents.count,
      activeStudents: activeStudents.count,
      graduatedStudents: graduatedStudents.count,
      totalPayments: totalPayments.count,
      totalRevenue: totalPayments.total,
      pendingPayments: pendingPayments.count,
      overduePayments: overduePayments.count,
      studentsByLevel,
      recentPayments,
      monthlyRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

router.put('/progress/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const { nivel, porcentaje, observaciones, estado } = req.body;

    db.run(
      "UPDATE progreso SET porcentaje = ?, observaciones = ?, estado = ?, updated_at = datetime('now') WHERE estudiante_id = ? AND nivel = ?",
      [porcentaje, observaciones, estado, studentId, nivel]
    );

    const avgResult = db.get('SELECT AVG(porcentaje) as avg FROM progreso WHERE estudiante_id = ?', [studentId]);
    if (avgResult) {
      db.run('UPDATE estudiantes SET porcentaje_progreso = ?, updated_at = datetime("now") WHERE id = ?', [avgResult.avg || 0, studentId]);
    }

    const updated = db.get('SELECT * FROM progreso WHERE estudiante_id = ? AND nivel = ?', [studentId, nivel]);
    res.json(updated || { message: 'Progreso actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar progreso' });
  }
});

module.exports = router;
