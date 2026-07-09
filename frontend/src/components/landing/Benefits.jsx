import React from 'react';
import { FiZap, FiHeart, FiUsers, FiSmile, FiClock, FiTarget, FiCalendar } from 'react-icons/fi';

const benefits = [
  { icon: <FiZap size={28} />, title: 'Desarrollo Cognitivo', description: 'La música mejora la memoria, concentración y habilidades matemáticas.' },
  { icon: <FiHeart size={28} />, title: 'Expresión Emocional', description: 'Aprende a canalizar tus emociones a través del arte musical.' },
  { icon: <FiUsers size={28} />, title: 'Trabajo en Equipo', description: 'Participa en ensambles y desarrolla habilidades colaborativas.' },
  { icon: <FiSmile size={28} />, title: 'Confianza y Autoestima', description: 'Presentaciones y recitales que fortalecen tu seguridad personal.' },
  { icon: <FiClock size={28} />, title: 'Disciplina y Paciencia', description: 'La práctica musical cultiva hábitos de constancia y dedicación.' },
  { icon: <FiTarget size={28} />, title: 'Metas Claras', description: 'Sistema de niveles con objetivos definidos y progreso medible.' },
  { icon: <FiCalendar size={28} />, title: 'Horarios Flexibles', description: 'Clases 3 veces por semana, 1 hora cada una, de lunes a viernes. Adaptamos tu horario.' },
];

const Benefits = () => {
  return (
    <section id="beneficios" className="py-5" style={{ background: 'var(--light-bg)' }}>
      <div className="container py-5">
        <div className="text-center mb-5 fade-in">
          <h2 className="section-title display-5">Beneficios de Aprender Música</h2>
          <div className="gold-accent"></div>
          <p className="section-subtitle">
            Más que notas musicales: descubre cómo la música transforma tu vida en múltiples dimensiones.
          </p>
        </div>
        <div className="row g-4">
          {benefits.map((benefit, index) => (
            <div className="col-md-6 col-lg-4" key={index}>
              <div className="card-custom p-4 h-100 d-flex slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="me-3 flex-shrink-0" style={{ color: 'var(--accent-gold)' }}>
                  {benefit.icon}
                </div>
                <div>
                  <h5 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{benefit.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
