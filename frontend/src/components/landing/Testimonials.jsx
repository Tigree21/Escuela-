import React from 'react';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  { name: 'María García', role: 'Estudiante de Piano', text: 'La mejor decisión que he tomado. Los profesores son increíblemente pacientes y talentosos. En solo 3 meses pasé de no saber nada a tocar mis primeras canciones.' },
  { name: 'Carlos López', role: 'Estudiante de Guitarra', text: 'El sistema de niveles me mantiene motivado. Saber exactamente qué necesito lograr para avanzar hace que el aprendizaje sea muy claro y gratificante.' },
  { name: 'Ana Martínez', role: 'Madre de Estudiante', text: 'Mi hija ha florecido desde que empezó aquí. No solo aprendió música, también ganó confianza y disciplina. Totalmente recomendados.' },
];

const Testimonials = () => {
  return (
    <section className="py-5" style={{ background: 'var(--gradient-primary)' }}>
      <div className="container py-5">
        <div className="text-center mb-5 fade-in">
          <h2 className="display-5 text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Lo que dicen nuestros <span className="gold-text">estudiantes</span>
          </h2>
          <div className="gold-accent"></div>
        </div>
        <div className="row g-4">
          {testimonials.map((t, index) => (
            <div className="col-lg-4" key={index}>
              <div className="p-4 h-100 slide-up" style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255,255,255,0.1)',
                animationDelay: `${index * 0.15}s`,
              }}>
                <div className="d-flex gap-1 mb-3" style={{ color: 'var(--accent-gold)' }}>
                  {[...Array(5)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                </div>
                <p className="text-light mb-4" style={{ fontSize: '0.95rem', lineHeight: 1.7, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div>
                  <h6 className="text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{t.name}</h6>
                  <small style={{ color: 'var(--accent-gold)' }}>{t.role}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
