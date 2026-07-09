import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCheckCircle, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import { attendanceAPI } from '../../services/api';

const AttendanceCard = () => {
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const [statsRes, recordsRes] = await Promise.all([
        attendanceAPI.getMyStats(),
        attendanceAPI.getMyAttendance(),
      ]);
      setStats(statsRes.data);
      setRecords(recordsRes.data);
    } catch (error) {
      console.error('Error al cargar asistencia');
    }
  };

  return (
    <div className="card-custom p-4">
      <h5 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
        <FiCalendar className="me-2" style={{ color: 'var(--accent-gold)' }} />
        Asistencia (Últimos 30 días)
      </h5>
      {stats ? (
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
      ) : (
        <div className="text-center py-3">
          <FiTrendingUp size={28} className="text-muted mb-2" />
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Cargando...</p>
        </div>
      )}
      {records.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          {records.slice(0, 10).map((r) => (
            <div key={r.id} className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{
              background: r.presente ? '#d4edda' : '#f8d7da',
              fontSize: '0.75rem',
            }}>
              {r.presente ? <FiCheckCircle size={12} style={{ color: '#155724' }} /> : <FiXCircle size={12} style={{ color: '#721c24' }} />}
              <span style={{ color: r.presente ? '#155724' : '#721c24', fontWeight: 500 }}>
                {new Date(r.fecha).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceCard;
