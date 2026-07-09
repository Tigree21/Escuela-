import React from 'react';
import { Link } from 'react-router-dom';
import { FiMusic, FiLock } from 'react-icons/fi';

const Register = () => {
  return (
    <section className="min-vh-100 d-flex align-items-center py-4" style={{ background: 'var(--gradient-primary)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="text-center mb-4 fade-in">
              <FiMusic style={{ fontSize: '2.5rem', color: 'var(--accent-gold)' }} className="mb-2" />
              <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                <span className="gold-text">Armonía</span> Musical
              </h2>
              <p className="text-light">Registro solo para administradores</p>
            </div>
            <div className="card-custom p-5 text-center slide-up">
              <div className="d-inline-flex align-items-center justify-content-center mb-4" style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(201,168,76,0.15)', color: 'var(--accent-gold)',
              }}>
                <FiLock size={36} />
              </div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Registro Restringido</h4>
              <p className="text-muted mb-4">
                Solo un administrador puede crear cuentas de estudiante. Si ya tienes una cuenta, inicia sesión.
              </p>
              <Link to="/login" className="btn btn-gold px-4">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
