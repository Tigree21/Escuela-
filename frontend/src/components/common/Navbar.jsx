import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMusic, FiUser, FiLogOut, FiSettings, FiHome } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'var(--gradient-primary)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FiMusic className="me-2" style={{ color: 'var(--accent-gold)', fontSize: '1.5rem' }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            H.M.A.S <span className="gold-text">Armonía</span>
          </span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/"><FiHome className="me-1" /> Inicio</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <FiUser className="me-1" /> Panel
                  </Link>
                </li>
                {user.rol === 'administrador' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      <FiSettings className="me-1" /> Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <span className="nav-link text-light">
                    <FiUser className="me-1" />
                    {user.nombre}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                    <FiLogOut className="me-1" /> Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
                  <li className="nav-item ms-lg-2">
                    <Link className="btn btn-gold btn-sm" to="/login">Acceder</Link>
                  </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
