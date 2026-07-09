const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seed() {
  try {
    console.log('Iniciando seed de la base de datos...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const demoPassword = await bcrypt.hash('demo123', 10);

    const existingAdmin = db.get('SELECT id FROM users WHERE correo = ?', ['admin@armoniamusical.com']);
    if (!existingAdmin) {
      db.run('INSERT INTO users (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', ['Administrador', 'admin@armoniamusical.com', adminPassword, 'administrador']);
      console.log('Admin creado: admin@armoniamusical.com / admin123');
    } else {
      db.run('UPDATE users SET password = ? WHERE correo = ?', [adminPassword, 'admin@armoniamusical.com']);
      console.log('Admin actualizado: admin@armoniamusical.com / admin123');
    }

    const existingDemo = db.get('SELECT id FROM users WHERE correo = ?', ['demo@armoniamusical.com']);
    let userId;
    if (!existingDemo) {
      const result = db.run('INSERT INTO users (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', ['Estudiante Demo', 'demo@armoniamusical.com', demoPassword, 'estudiante']);
      userId = result.lastInsertRowid;
      console.log('Demo creado: demo@armoniamusical.com / demo123');
    } else {
      userId = existingDemo.id;
      db.run('UPDATE users SET password = ? WHERE correo = ?', [demoPassword, 'demo@armoniamusical.com']);
      console.log('Demo actualizado: demo@armoniamusical.com / demo123');
    }

    const existingStudent = db.get('SELECT id FROM estudiantes WHERE usuario_id = ?', [userId]);
    let studentId;
    if (!existingStudent) {
      const result = db.run(
        'INSERT INTO estudiantes (usuario_id, fecha_inscripcion, nivel_actual, porcentaje_progreso, estado) VALUES (?, date("now"), 1, 0, "activo")',
        [userId]
      );
      studentId = result.lastInsertRowid;
    } else {
      studentId = existingStudent.id;
    }

    const existingProgress = db.get('SELECT id FROM progreso WHERE estudiante_id = ? AND nivel = 1', [studentId]);
    if (!existingProgress) {
      db.run('INSERT INTO progreso (estudiante_id, nivel, porcentaje, fecha_inicio, estado) VALUES (?, 1, 0, date("now"), "en_curso")', [studentId]);
    }

    const existingPayment = db.get('SELECT id FROM pagos WHERE estudiante_id = ? AND nivel = 1', [studentId]);
    if (!existingPayment) {
      db.run('INSERT INTO pagos (estudiante_id, nivel, monto, fecha_vencimiento, estado) VALUES (?, 1, 49.99, date("now", "+30 days"), "pendiente")', [studentId]);
    }

    const existingMessages = db.get('SELECT id FROM mensajes LIMIT 1');
    if (!existingMessages) {
      db.run('INSERT INTO mensajes (titulo, contenido, tipo) VALUES (?, ?, ?)', ['¡Bienvenido a H.M.A.S Armonía Musical!', 'Estamos emocionados de tenerte con nosotros. Comienza tu viaje musical hoy.', 'anuncio']);
      db.run('INSERT INTO mensajes (titulo, contenido, tipo) VALUES (?, ?, ?)', ['Próximo recital de estudiantes', 'El recital mensual será el último viernes del mes. ¡Prepárate!', 'general']);
      db.run('INSERT INTO mensajes (titulo, contenido, tipo) VALUES (?, ?, ?)', ['Recordatorio de pago', 'Recuerda mantener tus pagos al día para continuar con tus clases.', 'recordatorio']);
    }

    console.log('Seed completado exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error durante el seed:', error);
    process.exit(1);
  }
}

seed();
