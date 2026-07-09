import React from 'react';
import { FiMusic, FiStar, FiTrendingUp, FiAward, FiLayers } from 'react-icons/fi';

const levelGroups = [
  {
    icon: <FiMusic size={32} />,
    title: 'Niveles 1-3: Iniciación',
    levels: '3 niveles · 3 meses',
    price: 'Bs 350 / $51 USD por mes',
    description: 'Fundamentos de la música, ritmo, notas básicas, lectura de partituras y técnicas iniciales.',
    color: '#c9a84c',
  },
  {
    icon: <FiTrendingUp size={32} />,
    title: 'Niveles 4-6: Intermedio',
    levels: '3 niveles · 3 meses',
    price: 'Bs 350 / $51 USD por mes',
    description: 'Escalas, acordes, progresiones armónicas y técnicas avanzadas de interpretación.',
    color: '#e8c95a',
  },
  {
    icon: <FiAward size={32} />,
    title: 'Niveles 7-9: Avanzado',
    levels: '3 niveles · 3 meses',
    price: 'Bs 350 / $51 USD por mes',
    description: 'Improvisación, composición, arreglos musicales y presentación final con masterclass.',
    color: '#a8882e',
  },
];

const Courses = () => {
  return (
    <section id="cursos" className="py-5" style={{ background: 'var(--white)' }}>
      <div className="container py-5">
        <div className="text-center mb-5 fade-in">
          <h2 className="section-title display-5">Nuestros Cursos</h2>
          <div className="gold-accent"></div>
          <p className="section-subtitle">
            9 niveles de formación musical progresiva (3 meses por etapa). Clases 3 veces por semana, 1 hora cada una, de lunes a viernes.
          </p>
        </div>
        <div className="row g-4">
          {levelGroups.map((group, index) => (
            <div className="col-lg-4" key={index}>
              <div className="card-custom p-4 h-100 text-center slide-up" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{
                  width: '70px', height: '70px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${group.color}22, ${group.color}11)`,
                  color: group.color,
                }}>
                  {group.icon}
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2 flex-wrap">
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill" style={{
                    background: 'var(--gradient-gold)', color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: 600,
                  }}>
                    <FiStar size={14} /> {group.levels}
                  </span>
                  <span className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill" style={{
                    background: '#0a1628', color: '#c9a84c', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #c9a84c',
                  }}>
                    {group.price}
                  </span>
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{group.title}</h4>
                <p className="text-muted">{group.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <span className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill" style={{
            background: 'var(--light-bg)', fontSize: '0.9rem',
          }}>
            <FiLayers style={{ color: 'var(--accent-gold)' }} />
            <strong>9 niveles</strong> en total · <strong>9 meses</strong> de formación completa · <strong>Bs 350 / $51 USD</strong> por nivel
          </span>
        </div>
      </div>
    </section>
  );
};

export default Courses;
