import React from 'react';
import { Link } from 'react-router-dom';
import { FiMusic, FiArrowRight, FiPlay } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="position-relative overflow-hidden" style={{
      background: 'var(--gradient-primary)',
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c9a84c\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: '60px 60px',
      }}></div>

      <div className="container position-relative">
        <div className="row align-items-center min-vh-80">
          <div className="col-lg-7 text-white slide-up">
            <div className="d-inline-flex align-items-center bg-white bg-opacity-10 rounded-pill px-3 py-1 mb-4">
              <FiMusic className="me-2" style={{ color: 'var(--accent-gold)' }} />
              <span style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>ESCUELA DE MÚSICA</span>
            </div>
            <h1 className="display-3 fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
              Donde tu <span className="gold-text">pasión</span> por la música<br />se convierte en realidad
            </h1>
            <p className="lead mb-4" style={{ color: 'var(--text-light)', maxWidth: '500px', fontSize: '1.15rem' }}>
              Clases personalizadas para todas las edades y niveles. Aprende con instructores calificados en un ambiente inspirador.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/login" className="btn btn-gold btn-lg d-flex align-items-center gap-2">
                Inicia Sesión <FiArrowRight />
              </Link>
              <a href="#cursos" className="btn btn-outline-light btn-lg d-flex align-items-center gap-2">
                <FiPlay /> Ver Cursos
              </a>
            </div>
            <div className="d-flex gap-4 mt-5">
              <div>
                <h3 className="gold-text mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>500+</h3>
                <small className="text-light">Estudiantes</small>
              </div>
              <div>
                <h3 className="gold-text mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>10+</h3>
                <small className="text-light">Años de experiencia</small>
              </div>
              <div>
                <h3 className="gold-text mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>100%</h3>
                <small className="text-light">Satisfacción</small>
              </div>
            </div>
          </div>
          <div className="col-lg-5 d-none d-lg-block fade-in">
            <div className="position-relative">
              <div style={{
                width: '400px', height: '400px', margin: '0 auto',
                background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '250px', height: '250px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid rgba(201,168,76,0.3)',
                  animation: 'pulse 3s ease-in-out infinite',
                }}>
                  <FiMusic style={{ fontSize: '5rem', color: 'var(--accent-gold)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '80px', background: 'linear-gradient(to top, var(--light-bg), transparent)',
      }}></div>
    </section>
  );
};

export default Hero;
