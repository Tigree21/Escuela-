import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMusic, FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.correo || !form.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.correo, form.password);
      toast.success(`¡Bienvenido ${user.nombre}!`);
      if (user.rol === 'administrador') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--gradient-primary)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="text-center mb-4 fade-in">
              <FiMusic style={{ fontSize: '2.5rem', color: 'var(--accent-gold)' }} className="mb-2" />
              <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                H.M.A.S <span className="gold-text">Armonía</span>
              </h2>
              <p className="text-light">Inicia sesión en tu cuenta</p>
            </div>
            <div className="card-custom p-4 slide-up">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Correo Electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text"><FiMail /></span>
                    <input type="email" className="form-control" placeholder="tu@correo.com"
                      value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text"><FiLock /></span>
                    <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Tu contraseña"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="remember" />
                    <label className="form-check-label" htmlFor="remember" style={{ fontSize: '0.9rem' }}>Recordarme</label>
                  </div>
                  <Link to="/forgot-password" style={{ color: 'var(--accent-gold)', fontSize: '0.9rem' }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <button type="submit" className="btn btn-gold w-100 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm" /> Iniciando...</> : <><FiLogIn /> Iniciar Sesión</>}
                </button>
              </form>
              <p className="text-center mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
                ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
