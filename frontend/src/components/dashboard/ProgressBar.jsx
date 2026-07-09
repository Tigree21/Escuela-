import React from 'react';
import { FiCheck } from 'react-icons/fi';

const ProgressBar = ({ nivelActual, porcentaje, progress }) => {
  const totalLevels = 9;
  const completedLevels = progress?.filter(p => p.estado === 'completado').length || 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted" style={{ fontSize: '0.9rem' }}>Progreso Total</span>
        <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '1.1rem' }}>
          {Math.round(porcentaje || 0)}%
        </span>
      </div>
      <div className="progress mb-2" style={{ height: '14px', borderRadius: '7px', background: '#e9ecef' }}>
        <div className="progress-bar" role="progressbar" style={{
          width: `${porcentaje || 0}%`,
          background: 'var(--gradient-gold)',
          borderRadius: '7px',
          transition: 'width 0.8s ease',
        }}></div>
      </div>
      <div className="d-flex justify-content-between mb-1">
        <small className="text-muted">Nivel {nivelActual > 9 ? 9 : nivelActual} de {totalLevels}</small>
        <small className="text-muted">{completedLevels} de {totalLevels} niveles completados</small>
      </div>
      <div className="d-flex gap-1 flex-wrap mt-3">
        {Array.from({ length: totalLevels }, (_, i) => i + 1).map(num => {
          const levelProgress = progress?.find(p => p.nivel === num);
          const completed = levelProgress?.estado === 'completado';
          const current = levelProgress?.estado === 'en_curso' || (num === 1 && !levelProgress);
          return (
            <div key={num} className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{
              background: completed ? '#d4edda' : current ? 'rgba(201,168,76,0.15)' : '#e9ecef',
              fontSize: '0.72rem', fontWeight: 500,
              color: completed ? '#155724' : current ? 'var(--accent-gold)' : '#adb5bd',
              border: current ? '1px solid var(--accent-gold)' : 'none',
            }}>
              {completed && <FiCheck size={10} />}
              N{num}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
