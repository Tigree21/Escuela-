const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function setup() {
  try {
    console.log('Ejecutando schema SQL...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.db.exec(schema);
    console.log('Tablas creadas correctamente.');

    console.log('Insertando datos de prueba...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const demoPassword = await bcrypt.hash('demo123', 10);

    const existingAdmin = db.get('SELECT id FROM users WHERE correo = ?', ['admin@armoniamusical.com']);
    if (!existingAdmin) {
      db.run('INSERT INTO users (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', ['Administrador', 'admin@armoniamusical.com', adminPassword, 'administrador']);
      console.log('  Admin: admin@armoniamusical.com / admin123');
    }

    const existingDemo = db.get('SELECT id FROM users WHERE correo = ?', ['demo@armoniamusical.com']);
    let userId;
    if (!existingDemo) {
      const result = db.run('INSERT INTO users (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', ['Estudiante Demo', 'demo@armoniamusical.com', demoPassword, 'estudiante']);
      userId = result.lastInsertRowid;
      console.log('  Demo: demo@armoniamusical.com / demo123');
    } else {
      userId = existingDemo.id;
    }

    const existingStudent = db.get('SELECT id FROM estudiantes WHERE usuario_id = ?', [userId]);
    let studentId;
    if (!existingStudent) {
      const r = db.run("INSERT INTO estudiantes (usuario_id, fecha_inscripcion, nivel_actual, porcentaje_progreso, estado) VALUES (?, date('now'), 1, 0, 'activo')", [userId]);
      studentId = r.lastInsertRowid;
    } else {
      studentId = existingStudent.id;
    }

    const p1 = db.get('SELECT id FROM progreso WHERE estudiante_id = ? AND nivel = 1', [studentId]);
    if (!p1) {
      db.run("INSERT INTO progreso (estudiante_id, nivel, porcentaje, fecha_inicio, estado) VALUES (?, 1, 0, date('now'), 'en_curso')", [studentId]);
    }

    const pay = db.get('SELECT id FROM pagos WHERE estudiante_id = ?', [studentId]);
    if (!pay) {
      db.run("INSERT INTO pagos (estudiante_id, nivel, monto, fecha_vencimiento, estado) VALUES (?, 1, 51, date('now', '+30 days'), 'pagado')", [studentId]);
    }

    const msgs = db.get('SELECT id FROM mensajes LIMIT 1');
    if (!msgs) {
      db.run('INSERT INTO mensajes (titulo, contenido, tipo) VALUES (?, ?, ?)', ['¡Bienvenido a H.M.A.S Armonía Musical!', 'Estamos emocionados de tenerte con nosotros. Comienza tu viaje musical hoy.', 'anuncio']);
      db.run('INSERT INTO mensajes (titulo, contenido, tipo) VALUES (?, ?, ?)', ['Próximo recital de estudiantes', 'El recital mensual será el último viernes del mes. ¡Prepárate!', 'general']);
      db.run('INSERT INTO mensajes (titulo, contenido, tipo) VALUES (?, ?, ?)', ['Recordatorio de pago', 'Recuerda mantener tus pagos al día para continuar con tus clases.', 'recordatorio']);
    }

    console.log('¡Setup completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setup();
