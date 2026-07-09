import React from 'react';
import { FiMusic, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--gradient-primary)', color: 'var(--white)', padding: '3rem 0 1.5rem' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center mb-3">
              <FiMusic className="me-2" style={{ color: 'var(--accent-gold)', fontSize: '1.8rem' }} />
              <h5 style={{ fontFamily: "'Playfair Display', serif", margin: 0 }}>
                H.M.A.S <span className="gold-text">Armonía</span>
              </h5>
            </div>
            <p className="text-light" style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
              Transformando vidas a través de la música. Más de 10 años formando músicos con pasión y excelencia.
            </p>
          </div>
          <div className="col-lg-4">
            <h6 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent-gold)', marginBottom: '1rem' }}>Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/" className="text-light" style={{ fontSize: '0.9rem' }}>Inicio</a></li>
              <li className="mb-2"><a href="/#cursos" className="text-light" style={{ fontSize: '0.9rem' }}>Cursos</a></li>
              <li className="mb-2"><a href="/#beneficios" className="text-light" style={{ fontSize: '0.9rem' }}>Beneficios</a></li>
              <li className="mb-2"><a href="/#contacto" className="text-light" style={{ fontSize: '0.9rem' }}>Contacto</a></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h6 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--accent-gold)', marginBottom: '1rem' }}>Contacto</h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <FiMapPin className="me-2" style={{ color: 'var(--accent-gold)' }} />
                <span style={{ fontSize: '0.9rem' }}>Av. 6 de Agosto entre Tarija y Ejército, casa #464</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FiPhone className="me-2" style={{ color: 'var(--accent-gold)' }} />
                <span style={{ fontSize: '0.9rem' }}>+591 73957635</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FiMail className="me-2" style={{ color: 'var(--accent-gold)' }} />
                <span style={{ fontSize: '0.9rem' }}>contacto@armoniamusical.com</span>
              </li>
            </ul>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0 1rem' }} />
        <p className="text-center text-light mb-0" style={{ fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} H.M.A.S Armonia Musical. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
