import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMusic, FiMail, FiSend, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [correo, setCorreo] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo) {
      toast.error('Ingresa tu correo electrónico');
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 2000));
    setSending(false);
    setSent(true);
    toast.success('Instrucciones enviadas a tu correo');
  };

  return (
    <section className="min-vh-100 d-flex align-items-center" style={{ background: 'var(--gradient-primary)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="text-center mb-4 fade-in">
              <FiMusic style={{ fontSize: '2.5rem', color: 'var(--accent-gold)' }} className="mb-2" />
              <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                Recuperar <span className="gold-text">Contraseña</span>
              </h2>
              <p className="text-light">Te enviaremos instrucciones para restablecer tu contraseña</p>
            </div>
            <div className="card-custom p-4 slide-up">
              {sent ? (
                <div className="text-center py-4">
                  <div className="mb-3 d-inline-flex align-items-center justify-content-center" style={{
                    width: '70px', height: '70px', borderRadius: '50%', background: 'var(--gradient-gold)',
                  }}>
                    <FiCheck size={32} style={{ color: 'var(--primary-dark)' }} />
                  </div>
                  <h5 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Correo Enviado</h5>
                  <p className="text-muted">Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
                  <Link to="/login" className="btn btn-gold d-inline-flex align-items-center gap-2">
                    <FiArrowLeft /> Volver al Inicio de Sesión
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Correo Electrónico</label>
                    <div className="input-group">
                      <span className="input-group-text"><FiMail /></span>
                      <input type="email" className="form-control" placeholder="tu@correo.com"
                        value={correo} onChange={e => setCorreo(e.target.value)} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-gold w-100 d-flex align-items-center justify-content-center gap-2" disabled={sending}>
                    {sending ? <><span className="spinner-border spinner-border-sm" /> Enviando...</> : <><FiSend /> Enviar Instrucciones</>}
                  </button>
                </form>
              )}
              <div className="text-center mt-3">
                <Link to="/login" className="d-inline-flex align-items-center gap-1" style={{ color: 'var(--accent-gold)', fontSize: '0.9rem' }}>
                  <FiArrowLeft /> Volver al inicio de sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
