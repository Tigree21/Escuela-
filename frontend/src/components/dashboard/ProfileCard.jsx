import React from 'react';
import { FiUser, FiCalendar, FiPhone, FiMail, FiAward } from 'react-icons/fi';

const ProfileCard = ({ student, getStatusBadge }) => {
  return (
    <div className="card-custom p-4 text-center slide-up">
      <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{
        width: '90px', height: '90px', borderRadius: '50%',
        background: 'var(--gradient-primary)',
        border: '3px solid var(--accent-gold)',
        overflow: 'hidden',
      }}>
        <FiUser size={36} style={{ color: 'var(--accent-gold)' }} />
      </div>
      <h4 className="mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
        {student.nombre}
      </h4>
      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>{student.correo}</p>
      <div className="mb-3">{getStatusBadge(student.estado)}</div>
      <hr />
      <div className="text-start">
        {student.telefono && (
          <div className="d-flex align-items-center gap-2 mb-2">
            <FiPhone size={14} style={{ color: 'var(--accent-gold)' }} />
            <small className="text-muted">{student.telefono}</small>
          </div>
        )}
        <div className="d-flex align-items-center gap-2 mb-2">
          <FiCalendar size={14} style={{ color: 'var(--accent-gold)' }} />
          <small className="text-muted">
            Inscrito: {new Date(student.fecha_inscripcion).toLocaleDateString()}
          </small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <FiAward size={14} style={{ color: 'var(--accent-gold)' }} />
          <small className="text-muted">
            {student.estado === 'graduado' ? '¡Graduado!' : `Nivel ${student.nivel_actual > 9 ? 9 : student.nivel_actual} de 9`}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
