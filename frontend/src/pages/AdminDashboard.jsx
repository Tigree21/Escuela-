import React, { useState, useEffect } from 'react';
import { FiUsers, FiDollarSign, FiTrendingUp, FiAward, FiAlertCircle, FiClock, FiLogOut, FiRefreshCw, FiBarChart2, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import StudentsTable from '../components/admin/StudentsTable';
import PaymentsPanel from '../components/admin/PaymentsPanel';
import StatsCharts from '../components/admin/StatsCharts';
import AttendancePanel from '../components/admin/AttendancePanel';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes, paymentsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getStudents(),
        adminAPI.getPayments(),
      ]);
      setStats(statsRes.data);
      setStudents(studentsRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      toast.error('Error al cargar datos del panel');
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
          <div className="spinner-border mb-3" style={{ color: 'var(--accent-gold)', width: '3rem', height: '3rem' }} role="status" />
          <p className="text-muted">Cargando panel administrativo...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
    { id: 'students', label: 'Estudiantes', icon: <FiUsers /> },
    { id: 'payments', label: 'Pagos', icon: <FiDollarSign /> },
    { id: 'attendance', label: 'Asistencia', icon: <FiCalendar /> },
  ];

  return (
    <div style={{ background: 'var(--light-bg)', minHeight: 'calc(100vh - 76px)' }}>
      <div style={{ background: 'var(--gradient-primary)', padding: '1.5rem 0' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h2 className="text-white mb-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                Panel de Administración
              </h2>
              <p className="text-light mb-0">
                <FiUsers className="me-1" style={{ color: 'var(--accent-gold)' }} />
                Bienvenido, {user?.nombre}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" onClick={loadData}>
                <FiRefreshCw /> Actualizar
              </button>
              <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-1" onClick={handleLogout}>
                <FiLogOut /> Salir
              </button>
            </div>
          </div>
          <ul className="nav nav-tabs mt-3" style={{ borderBottomColor: 'rgba(255,255,255,0.2)' }}>
            {tabs.map(tab => (
              <li className="nav-item" key={tab.id}>
                <button className={`nav-link d-flex align-items-center gap-1 ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    color: activeTab === tab.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.7)',
                    borderColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                    background: activeTab === tab.id ? 'var(--white)' : 'transparent',
                    fontWeight: activeTab === tab.id ? 600 : 400,
                  }}>
                  {tab.icon} {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container py-4">
        {activeTab === 'dashboard' && stats && (
          <>
            <div className="row g-3 mb-4">
              {[
                { label: 'Total Estudiantes', value: stats.totalStudents, icon: <FiUsers />, color: '#0f1f3d' },
                { label: 'Estudiantes Activos', value: stats.activeStudents, icon: <FiTrendingUp />, color: '#28a745' },
                { label: 'Graduados', value: stats.graduatedStudents, icon: <FiAward />, color: '#c9a84c' },
                { label: 'Ingresos Totales', value: `Bs ${Math.round((stats.totalRevenue || 0) * 350 / 51)}`, icon: <FiDollarSign />, color: '#0f1f3d' },
                { label: 'Pagos Pendientes', value: stats.pendingPayments, icon: <FiClock />, color: '#ffc107' },
                { label: 'Pagos Vencidos', value: stats.overduePayments, icon: <FiAlertCircle />, color: '#dc3545' },
              ].map((item, idx) => (
                <div className="col-6 col-md-4 col-lg-2" key={idx}>
                  <div className="card-custom p-3 text-center slide-up">
                    <div className="d-inline-flex align-items-center justify-content-center mb-2" style={{
                      width: '40px', height: '40px', borderRadius: '10px', background: item.color + '15', color: item.color, fontSize: '1.2rem',
                    }}>
                      {item.icon}
                    </div>
                    <h4 className="mb-0" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.3rem' }}>
                      {item.value}
                    </h4>
                    <small className="text-muted">{item.label}</small>
                  </div>
                </div>
              ))}
            </div>
            <StatsCharts stats={stats} />
          </>
        )}

        {activeTab === 'students' && (
          <StudentsTable students={students} onRefresh={loadData} />
        )}

        {activeTab === 'payments' && (
          <PaymentsPanel payments={payments} onRefresh={loadData} />
        )}

        {activeTab === 'attendance' && (
          <AttendancePanel students={students} onRefresh={loadData} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
