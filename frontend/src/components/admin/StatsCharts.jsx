import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { FiBarChart2, FiPieChart } from 'react-icons/fi';

const COLORS = ['#c9a84c', '#0f1f3d', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];

const StatsCharts = ({ stats }) => {
  const levelData = stats.studentsByLevel?.map(item => ({
    name: `Nivel ${item.nivel_actual}`,
    value: parseInt(item.count),
  })) || [];

  const formatBs = (usd) => Math.round(parseFloat(usd) * 350 / 51);
  const revenueData = stats.monthlyRevenue?.map(item => ({
    month: new Date(item.mes).toLocaleDateString('es', { month: 'short', year: '2-digit' }),
    revenue: formatBs(item.total),
  })).reverse() || [];

  const paymentStatusData = [
    { name: 'Pagados', value: stats.totalPayments || 0 },
    { name: 'Pendientes', value: stats.pendingPayments || 0 },
    { name: 'Vencidos', value: stats.overduePayments || 0 },
  ];

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <div className="card-custom p-4">
          <h6 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            <FiBarChart2 className="me-2" style={{ color: 'var(--accent-gold)' }} />
                Ingresos Mensuales (Bs)
          </h6>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#c9a84c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card-custom p-4">
          <h6 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            <FiPieChart className="me-2" style={{ color: 'var(--accent-gold)' }} />
            Estados de Pago
          </h6>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                paddingAngle={5} dataKey="value">
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card-custom p-4 mt-4">
          <h6 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            Distribución por Nivel
          </h6>
          {levelData.map((item, idx) => (
            <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
              <div className="d-flex align-items-center gap-2">
                <div className="progress" style={{ width: '120px', height: '8px', borderRadius: '4px' }}>
                  <div className="progress-bar" style={{
                    width: `${(item.value / Math.max(...levelData.map(d => d.value)) * 100)}%`,
                    background: COLORS[idx],
                    borderRadius: '4px',
                  }}></div>
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;
