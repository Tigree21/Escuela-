const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

router.post('/register', authenticate, authorizeAdmin, [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('correo').isEmail().withMessage('Correo inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, correo, password, telefono } = req.body;

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
    const user = db.get('SELECT id, nombre, correo, rol FROM users WHERE id = ?', [result.lastInsertRowid]);

    const studentResult = db.run(
      "INSERT INTO estudiantes (usuario_id, telefono, fecha_inscripcion, nivel_actual, porcentaje_progreso, estado) VALUES (?, ?, date('now'), 1, 0, ?)",
      [user.id, telefono || null, 'activo']
    );

    db.run(
      "INSERT INTO progreso (estudiante_id, nivel, porcentaje, fecha_inicio, estado) VALUES (?, 1, 0, date('now'), ?)",
      [studentResult.lastInsertRowid, 'en_curso']
    );

    db.run(
      "INSERT INTO pagos (estudiante_id, nivel, monto, fecha_vencimiento, estado) VALUES (?, 1, 51, date('now', '+30 days'), 'pagado')",
      [studentResult.lastInsertRowid]
    );

    res.status(201).json({ message: 'Estudiante registrado correctamente', id: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

router.post('/login', [
  body('correo').isEmail().withMessage('Correo inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { correo, password } = req.body;

    const user = db.get('SELECT * FROM users WHERE correo = ?', [correo]);
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol, foto_url: user.foto_url }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

router.get('/profile', authenticate, (req, res) => {
  try {
    const user = db.get(
      `SELECT u.id, u.nombre, u.correo, u.rol, u.foto_url, u.created_at,
              e.id as estudiante_id, e.telefono, e.fecha_nacimiento, e.direccion,
              e.fecha_inscripcion, e.nivel_actual, e.porcentaje_progreso, e.estado
       FROM users u
       LEFT JOIN estudiantes e ON e.usuario_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
});

router.put('/profile', authenticate, (req, res) => {
  try {
    const { nombre, telefono, direccion, foto_url } = req.body;
    const userId = req.user.id;

    if (nombre) {
      db.run("UPDATE users SET nombre = ?, updated_at = datetime('now') WHERE id = ?", [nombre, userId]);
    }
    if (foto_url) {
      db.run("UPDATE users SET foto_url = ?, updated_at = datetime('now') WHERE id = ?", [foto_url, userId]);
    }
    if (telefono || direccion) {
      const updates = [];
      const values = [];
      if (telefono !== undefined) { updates.push('telefono = ?'); values.push(telefono); }
      if (direccion !== undefined) { updates.push('direccion = ?'); values.push(direccion); }
      values.push(userId);
      db.run(
        `UPDATE estudiantes SET ${updates.join(', ')}, updated_at = datetime('now') WHERE usuario_id = ?`,
        values
      );
    }

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

module.exports = router;
