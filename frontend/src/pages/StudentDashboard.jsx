import React, { useState, useEffect } from 'react';
import { FiMusic, FiUser, FiDollarSign, FiTrendingUp, FiCalendar, FiCheckCircle, FiClock, FiAlertCircle, FiAward, FiMessageCircle, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { studentAPI, paymentAPI, progressAPI } from '../services/api';
import ProfileCard from '../components/dashboard/ProfileCard';
import ProgressBar from '../components/dashboard/ProgressBar';
import PaymentHistory from '../components/dashboard/PaymentHistory';
import AttendanceCard from '../components/dashboard/AttendanceCard';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.rol === 'administrador') {
      navigate('/admin', { replace: true });
      return;
    }
  }, [user, navigate]);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.rol !== 'administrador') {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh', background: 'var(--light-bg)' }}>
        <div className="text-center">
          <div className="spinner-border mb-3" style={{ color: 'var(--accent-gold)', width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <FiAlertCircle size={48} style={{ color: 'var(--accent-gold)' }} className="mb-3" />
          <h4>No se pudo cargar la información</h4>
          <button className="btn btn-gold mt-3" onClick={loadDashboard}>Reintentar</button>
        </div>
      </div>
    );
  }

  const { student, payments, progress, messages, nextPayment } = dashboardData;

  const getStatusBadge = (estado) => {
    const config = {
      activo: { bg: '#d4edda', color: '#155724', icon: <FiCheckCircle />, text: 'Activo' },
      graduado: { bg: '#cce5ff', color: '#004085', icon: <FiAward />, text: 'Graduado' },
      suspendido: { bg: '#fff3cd', color: '#856404', icon: <FiAlertCircle />, text: 'Suspendido' },
      inactivo: { bg: '#f8d7da', color: '#721c24', icon: <FiClock />, text: 'Inactivo' },
    };
    const c = config[estado] || config.activo;
    return (
      <span className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill" style={{ background: c.bg, color: c.color, fontSize: '0.85rem', fontWeight: 500 }}>
        {c.icon} {c.text}
      </span>
    );
  };

  return (
    <div style={{ background: 'var(--light-bg)', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ background: 'var(--gradient-primary)', padding: '2rem 0 4rem' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2 className="text-white mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                Panel de Estudiante
              </h2>
              <p className="text-light mb-0">
                <FiMusic className="me-1" style={{ color: 'var(--accent-gold)' }} />
                Bienvenido de vuelta, {student.nombre}
              </p>
            </div>
            <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-2" onClick={handleLogout}>
              <FiLogOut /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-2rem' }}>
        <div className="row g-4">
          <div className="col-lg-4">
            <ProfileCard student={student} getStatusBadge={getStatusBadge} />
          </div>
          <div className="col-lg-8">
            <div className="row g-4">
              <div className="col-sm-6">
                <div className="card-custom p-3 slide-up">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{
                      width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(201,168,76,0.15)', color: 'var(--accent-gold)',
                    }}>
                      <FiTrendingUp size={24} />
                    </div>
                    <div>
                      <small className="text-muted">Nivel Actual</small>
                      <h4 className="mb-0" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Nivel {student.nivel_actual > 9 ? 9 : student.nivel_actual} de 9</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card-custom p-3 slide-up">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{
                      width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(201,168,76,0.15)', color: 'var(--accent-gold)',
                    }}>
                      <FiDollarSign size={24} />
                    </div>
                    <div>
                      <small className="text-muted">Estado de Pago</small>
                      <h4 className="mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {nextPayment
                          ? <span style={{ color: nextPayment.estado === 'vencido' ? '#dc3545' : 'var(--accent-gold)' }}>
                              Bs {Math.round(parseFloat(nextPayment.monto) * 350 / 51)} / ${parseFloat(nextPayment.monto).toFixed(2)} USD
                            </span>
                          : <span style={{ color: '#28a745' }}>Al día</span>
                        }
                      </h4>
                      <small className="text-muted">
                        {nextPayment
                          ? `Vence: ${new Date(nextPayment.fecha_vencimiento).toLocaleDateString()}`
                          : 'Sin pagos pendientes'
                        }
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card-custom p-4 slide-up">
                  <h5 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                    <FiTrendingUp className="me-2" style={{ color: 'var(--accent-gold)' }} />
                    Progreso del Curso
                  </h5>
                  <ProgressBar nivelActual={student.nivel_actual} porcentaje={student.porcentaje_progreso} progress={progress} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-lg-7">
            <PaymentHistory payments={payments} />
          </div>
          <div className="col-lg-5">
            <AttendanceCard />
            <div className="mt-4">
            <div className="card-custom p-4">
              <h5 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                <FiMessageCircle className="me-2" style={{ color: 'var(--accent-gold)' }} />
                Anuncios y Mensajes
              </h5>
              {messages && messages.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {messages.map((msg, idx) => (
                    <div key={msg.id || idx} className="p-3" style={{
                      background: 'var(--light-bg)', borderRadius: 'var(--radius-sm)',
                      borderLeft: `3px solid ${msg.tipo === 'anuncio' ? 'var(--accent-gold)' : msg.tipo === 'recordatorio' ? '#17a2b8' : '#6c757d'}`,
                    }}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{msg.titulo}</h6>
                        <small className="text-muted">{new Date(msg.created_at).toLocaleDateString()}</small>
                      </div>
                      <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{msg.contenido}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FiMessageCircle size={36} className="text-muted mb-2" />
                  <p className="text-muted mb-0">No hay mensajes nuevos</p>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
