import React, { useState } from 'react';
import { FiSend, FiMail, FiPhone, FiMapPin, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Contact = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.correo || !form.mensaje) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success('Mensaje enviado correctamente');
    setForm({ nombre: '', correo: '', mensaje: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contacto" className="py-5" style={{ background: 'var(--light-bg)' }}>
      <div className="container py-5">
        <div className="text-center mb-5 fade-in">
          <h2 className="section-title display-5">Contáctanos</h2>
          <div className="gold-accent"></div>
          <p className="section-subtitle">
            ¿Tienes preguntas? Estamos aquí para ayudarte.
          </p>
        </div>
        <div className="row g-4 justify-content-center">
          <div className="col-lg-5">
            <div className="card-custom p-4 h-100">
              <h5 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: '1.5rem' }}>
                Información de Contacto
              </h5>
              <div className="d-flex align-items-center mb-3">
                <div className="me-3 d-flex align-items-center justify-content-center" style={{
                  width: '45px', height: '45px', borderRadius: '50%', background: 'var(--gradient-gold)',
                  color: 'var(--primary-dark)',
                }}>
                  <FiMapPin />
                </div>
                <div>
                  <small className="text-muted">Dirección</small>
                  <p className="mb-0 fw-medium">Av. 6 de Agosto entre Tarija y Ejército, casa #464</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="me-3 d-flex align-items-center justify-content-center" style={{
                  width: '45px', height: '45px', borderRadius: '50%', background: 'var(--gradient-gold)',
                  color: 'var(--primary-dark)',
                }}>
                  <FiPhone />
                </div>
                <div>
                  <small className="text-muted">Teléfono</small>
                  <p className="mb-0 fw-medium">+591 73957635</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-3 d-flex align-items-center justify-content-center" style={{
                  width: '45px', height: '45px', borderRadius: '50%', background: 'var(--gradient-gold)',
                  color: 'var(--primary-dark)',
                }}>
                  <FiMail />
                </div>
                <div>
                  <small className="text-muted">Email</small>
                  <p className="mb-0 fw-medium">contacto@armoniamusical.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <form onSubmit={handleSubmit} className="card-custom p-4">
              <h5 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: '1.5rem' }}>
                Envíanos un Mensaje
              </h5>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Tu nombre" />
              </div>
              <div className="mb-3">
                <label className="form-label">Correo Electrónico</label>
                <input type="email" className="form-control" value={form.correo}
                  onChange={e => setForm({ ...form, correo: e.target.value })}
                  placeholder="tu@correo.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Mensaje</label>
                <textarea className="form-control" rows="4" value={form.mensaje}
                  onChange={e => setForm({ ...form, mensaje: e.target.value })}
                  placeholder="¿En qué podemos ayudarte?"></textarea>
              </div>
              <button type="submit" className="btn btn-gold w-100 d-flex align-items-center justify-content-center gap-2" disabled={sending || sent}>
                {sent ? <><FiCheck /> Mensaje Enviado</> : sending ? <><span className="spinner-border spinner-border-sm" /> Enviando...</> : <><FiSend /> Enviar Mensaje</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
