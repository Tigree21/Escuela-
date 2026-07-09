import React from 'react';
import { FiDollarSign, FiCheckCircle, FiClock, FiAlertCircle, FiXCircle, FiDownload } from 'react-icons/fi';

const PaymentHistory = ({ payments }) => {
  const getStatusStyle = (estado) => {
    const styles = {
      pagado: { bg: '#d4edda', color: '#155724', icon: <FiCheckCircle />, text: 'Pagado' },
      pendiente: { bg: '#fff3cd', color: '#856404', icon: <FiClock />, text: 'Pendiente' },
      vencido: { bg: '#f8d7da', color: '#721c24', icon: <FiAlertCircle />, text: 'Vencido' },
      cancelado: { bg: '#e2e3e5', color: '#383d41', icon: <FiXCircle />, text: 'Cancelado' },
    };
    return styles[estado] || styles.pendiente;
  };

  return (
    <div className="card-custom p-4">
      <h5 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
        <FiDollarSign className="me-2" style={{ color: 'var(--accent-gold)' }} />
        Historial de Pagos
      </h5>
      {payments && payments.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Nivel</th>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Monto</th>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Fecha</th>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Vencimiento</th>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => {
                const s = getStatusStyle(p.estado);
                return (
                  <tr key={p.id || idx}>
                    <td style={{ fontWeight: 500 }}>Nivel {p.nivel}</td>
                    <td style={{ fontWeight: 600 }}>Bs {Math.round(parseFloat(p.monto) * 350 / 51)} / ${parseFloat(p.monto).toFixed(2)} USD</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(p.fecha_pago).toLocaleDateString()}</td>
                    <td style={{ fontSize: '0.85rem' }}>{new Date(p.fecha_vencimiento).toLocaleDateString()}</td>
                    <td>
                      <span className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{
                        background: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: 500,
                      }}>
                        {s.icon} {s.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4">
          <FiDollarSign size={36} className="text-muted mb-2" />
          <p className="text-muted mb-0">No hay pagos registrados</p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
