import React, { useState } from 'react';
import { FiDollarSign, FiCheckCircle, FiXCircle, FiSearch, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';

const PaymentsPanel = ({ payments, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const [processingId, setProcessingId] = useState(null);

  const filtered = payments.filter(p => {
    const matchSearch = p.estudiante_nombre?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || p.estado === filter;
    return matchSearch && matchFilter;
  });

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await adminAPI.updatePayment(id, { estado: 'pagado' });
      toast.success('Pago aprobado correctamente. Nivel desbloqueado.');
      onRefresh();
    } catch (error) {
      toast.error('Error al aprobar pago');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('¿Marcar este pago como cancelado?')) return;
    setProcessingId(id);
    try {
      await adminAPI.updatePayment(id, { estado: 'cancelado' });
      toast.success('Pago cancelado');
      onRefresh();
    } catch (error) {
      toast.error('Error al cancelar pago');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (estado) => {
    const config = {
      pagado: { bg: '#d4edda', color: '#155724' },
      pendiente: { bg: '#fff3cd', color: '#856404' },
      vencido: { bg: '#f8d7da', color: '#721c24' },
      cancelado: { bg: '#e2e3e5', color: '#383d41' },
    };
    const c = config[estado] || config.pendiente;
    return (
      <span className="badge" style={{ background: c.bg, color: c.color, fontWeight: 500, padding: '5px 10px' }}>
        {estado}
      </span>
    );
  };

  return (
    <div className="card-custom p-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h5 className="mb-0" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
          <FiDollarSign className="me-2" style={{ color: 'var(--accent-gold)' }} />
          Gestión de Pagos
        </h5>
        <div className="d-flex gap-2">
          <div className="input-group input-group-sm">
            <span className="input-group-text"><FiSearch /></span>
            <input type="text" className="form-control" placeholder="Buscar estudiante..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select form-select-sm" value={filter} onChange={e => setFilter(e.target.value)}
            style={{ width: 'auto' }}>
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="pagado">Pagados</option>
            <option value="vencido">Vencidos</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Estudiante</th>
              <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Nivel</th>
              <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Monto</th>
              <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Fecha</th>
              <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Vencimiento</th>
              <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Estado</th>
              <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.estudiante_nombre}</td>
                <td>Nivel {p.nivel}</td>
                <td style={{ fontWeight: 600 }}>Bs {Math.round(parseFloat(p.monto) * 350 / 51)} / ${parseFloat(p.monto).toFixed(2)} USD</td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(p.fecha_pago).toLocaleDateString()}</td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(p.fecha_vencimiento).toLocaleDateString()}</td>
                <td>{getStatusBadge(p.estado)}</td>
                <td>
                  {p.estado === 'pendiente' || p.estado === 'vencido' ? (
                    <div className="d-flex gap-1">
                      <button className="btn btn-success btn-sm d-flex align-items-center gap-1"
                        onClick={() => handleApprove(p.id)} disabled={processingId === p.id}>
                        <FiCheckCircle /> Aprobar
                      </button>
                      <button className="btn btn-danger btn-sm d-flex align-items-center gap-1"
                        onClick={() => handleReject(p.id)} disabled={processingId === p.id}>
                        <FiXCircle /> Rechazar
                      </button>
                    </div>
                  ) : (
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>Sin acciones</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">No se encontraron pagos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPanel;
