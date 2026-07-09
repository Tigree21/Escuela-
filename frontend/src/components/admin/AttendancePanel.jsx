import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCheckSquare, FiSquare, FiSearch, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';

const AttendancePanel = ({ students, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [present, setPresent] = useState(true);
  const [marking, setMarking] = useState(false);

  const filtered = students.filter(s =>
    !selectedStudent &&
    (s.nombre?.toLowerCase().includes(search.toLowerCase()) ||
     s.correo?.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    if (selectedStudent) {
      loadStudentAttendance(selectedStudent.estudiante_id);
    }
  }, [selectedStudent]);

  const loadStudentAttendance = async (estudianteId) => {
    try {
      const [recRes, statsRes] = await Promise.all([
        adminAPI.getAttendance(estudianteId),
        adminAPI.getAttendanceStats(estudianteId),
      ]);
      setRecords(recRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Error al cargar asistencia');
    }
  };

  const handleMark = async () => {
    if (!selectedStudent || !date) return;
    setMarking(true);
    try {
      await adminAPI.markAttendance({
        estudiante_id: selectedStudent.estudiante_id,
        fecha: date,
        presente: present ? 1 : 0,
      });
      toast.success(`Asistencia marcada como ${present ? 'presente' : 'ausente'}`);
      loadStudentAttendance(selectedStudent.estudiante_id);
    } catch (error) {
      toast.error('Error al marcar asistencia');
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="card-custom p-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h5 className="mb-0" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
          <FiCalendar className="me-2" style={{ color: 'var(--accent-gold)' }} />
          Control de Asistencia
        </h5>
      </div>

      {!selectedStudent ? (
        <>
          <div className="input-group input-group-sm mb-3" style={{ maxWidth: '300px' }}>
            <span className="input-group-text"><FiSearch /></span>
            <input type="text" className="form-control" placeholder="Buscar estudiante..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Nombre</th>
                  <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Correo</th>
                  <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Nivel</th>
                  <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500 }}>{s.nombre}</td>
                    <td style={{ fontSize: '0.85rem' }}>{s.correo}</td>
                    <td><span className="badge" style={{ background: 'var(--gradient-gold)', color: 'var(--primary-dark)' }}>Nivel {s.nivel_actual}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                        onClick={() => setSelectedStudent(s)}>
                        <FiCalendar /> Ver Asistencia
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">No se encontraron estudiantes</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h6 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                {selectedStudent.nombre}
              </h6>
              <small className="text-muted">Nivel {selectedStudent.nivel_actual}</small>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => { setSelectedStudent(null); setRecords([]); setStats(null); }}>
              Volver
            </button>
          </div>

          {stats && (
            <div className="row g-2 mb-3">
              <div className="col-4">
                <div className="text-center p-2" style={{ background: '#d4edda', borderRadius: '8px' }}>
                  <small className="text-muted">Presentes</small>
                  <h5 className="mb-0" style={{ color: '#155724', fontWeight: 700 }}>{stats.presentes}</h5>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center p-2" style={{ background: '#f8d7da', borderRadius: '8px' }}>
                  <small className="text-muted">Ausencias</small>
                  <h5 className="mb-0" style={{ color: '#721c24', fontWeight: 700 }}>{stats.ausencias}</h5>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center p-2" style={{ background: '#cce5ff', borderRadius: '8px' }}>
                  <small className="text-muted">% Asistencia</small>
                  <h5 className="mb-0" style={{ color: '#004085', fontWeight: 700 }}>{stats.porcentaje}%</h5>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex align-items-center gap-2 mb-3 p-3" style={{ background: 'var(--light-bg)', borderRadius: '8px' }}>
            <input type="date" className="form-control form-control-sm" style={{ maxWidth: '180px' }}
              value={date} onChange={e => setDate(e.target.value)} />
            <button className={`btn btn-sm d-flex align-items-center gap-1 ${present ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setPresent(true)}>
              <FiCheckSquare /> Presente
            </button>
            <button className={`btn btn-sm d-flex align-items-center gap-1 ${!present ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setPresent(false)}>
              <FiSquare /> Ausente
            </button>
            <button className="btn btn-gold btn-sm d-flex align-items-center gap-1"
              onClick={handleMark} disabled={marking}>
              {marking ? 'Guardando...' : 'Marcar'}
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Fecha</th>
                  <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Estado</th>
                  <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{new Date(r.fecha).toLocaleDateString()}</td>
                    <td>
                      {r.presente ? (
                        <span className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ background: '#d4edda', color: '#155724', fontSize: '0.8rem' }}>
                          <FiCheckCircle /> Presente
                        </span>
                      ) : (
                        <span className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ background: '#f8d7da', color: '#721c24', fontSize: '0.8rem' }}>
                          <FiXCircle /> Ausente
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-gray)' }}>{r.observaciones || '—'}</td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-muted">Sin registros de asistencia</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendancePanel;
