import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  { q: '¿Necesito experiencia previa para inscribirme?', a: 'No, aceptamos estudiantes de todos los niveles. Nuestro programa está diseñado para principiantes absolutos hasta músicos avanzados.' },
  { q: '¿Cuál es la edad mínima para ingresar?', a: 'No hay límite de edad. Tenemos estudiantes desde los 5 años hasta adultos mayores. Adaptamos la enseñanza a cada edad.' },
  { q: '¿Cuánto cuesta la mensualidad?', a: 'La mensualidad es de Bs 350 (aproximadamente $51 USD) por nivel. Cada nivel tiene duración de 1 mes con 3 clases por semana.' },
  { q: '¿Cómo funcionan los niveles y pagos?', a: 'Son 9 niveles en total, cada uno dura 1 mes. Al completar un nivel, debes realizar el pago del siguiente para continuar. El progreso se desbloquea solo con pago confirmado.' },
  { q: '¿Qué instrumentos puedo aprender?', a: 'Ofrecemos clases de piano, guitarra, violín, batería, canto y teoría musical. Consulta disponibilidad al inscribirte.' },
  { q: '¿Puedo cambiar de horario después de inscribirme?', a: 'Sí, puedes solicitar cambios de horario con 48 horas de anticipación, sujeto a disponibilidad.' },
  { q: '¿Ofrecen clases en línea?', a: 'Sí, contamos con modalidad presencial y en línea para adaptarnos a tus necesidades.' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-5" style={{ background: 'var(--white)' }}>
      <div className="container py-5">
        <div className="text-center mb-5 fade-in">
          <h2 className="section-title display-5">Preguntas Frecuentes</h2>
          <div className="gold-accent"></div>
          <p className="section-subtitle">
            Resuelve tus dudas sobre nuestro programa educativo.
          </p>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-3">
                <button
                  className="card-custom w-100 text-start p-3 d-flex justify-content-between align-items-center"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  style={{ cursor: 'pointer', border: 'none', background: openIndex === index ? 'var(--light-bg)' : 'var(--white)' }}
                >
                  <span style={{ fontWeight: 500, fontFamily: "'Playfair Display', serif", fontSize: '1.05rem' }}>
                    {faq.q}
                  </span>
                  {openIndex === index ? <FiChevronUp style={{ color: 'var(--accent-gold)' }} /> : <FiChevronDown style={{ color: 'var(--accent-gold)' }} />}
                </button>
                {openIndex === index && (
                  <div className="px-3 py-2 slide-up">
                    <p className="text-muted mb-0">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
