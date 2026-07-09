import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiUserPlus, FiSearch, FiCheckCircle, FiXCircle, FiSave, FiX, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';

const StudentsTable = ({ students, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ nombre: '', correo: '', password: '', telefono: '', direccion: '' });
  const [adding, setAdding] = useState(false);

  const filtered = students.filter(s =>
    s.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    s.correo?.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (student) => {
    setEditId(student.id);
    setEditForm({
      nombre: student.nombre,
      correo: student.correo,
      telefono: student.telefono || '',
      direccion: student.direccion || '',
      estado: student.estado,
      nivel_actual: student.nivel_actual,
    });
  };

  const handleSave = async (id) => {
    try {
      await adminAPI.updateStudent(id, editForm);
      toast.success('Estudiante actualizado');
      setEditId(null);
      onRefresh();
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar a "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await adminAPI.deleteStudent(id);
      toast.success('Estudiante eliminado');
      onRefresh();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.nombre || !addForm.correo || !addForm.password) {
      toast.error('Completa los campos obligatorios');
      return;
    }
    setAdding(true);
    try {
      await adminAPI.createStudent(addForm);
      toast.success('Estudiante creado');
      setShowAddModal(false);
      setAddForm({ nombre: '', correo: '', password: '', telefono: '', direccion: '' });
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear');
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="card-custom p-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h5 className="mb-0" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
            <FiUsers className="me-2" style={{ color: 'var(--accent-gold)' }} />
            Gestión de Estudiantes
          </h5>
          <div className="d-flex gap-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text"><FiSearch /></span>
              <input type="text" className="form-control" placeholder="Buscar estudiante..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-gold btn-sm d-flex align-items-center gap-1" onClick={() => setShowAddModal(true)}>
              <FiUserPlus /> Añadir
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Nombre</th>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Correo</th>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Nivel</th>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Progreso</th>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Estado</th>
                <th style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-gray)' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  {editId === s.id ? (
                    <>
                      <td><input className="form-control form-control-sm" value={editForm.nombre} onChange={e => setEditForm({...editForm, nombre: e.target.value})} /></td>
                      <td><input className="form-control form-control-sm" value={editForm.correo} onChange={e => setEditForm({...editForm, correo: e.target.value})} /></td>
                      <td>
                        <select className="form-select form-select-sm" value={editForm.nivel_actual} onChange={e => setEditForm({...editForm, nivel_actual: parseInt(e.target.value)})}>
                          {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>Nivel {n}</option>)}
                          <option value={10}>Graduado</option>
                        </select>
                      </td>
                      <td>{s.porcentaje_progreso?.toFixed(0)}%</td>
                      <td>
                        <select className="form-select form-select-sm" value={editForm.estado} onChange={e => setEditForm({...editForm, estado: e.target.value})}>
                          {['activo','graduado','suspendido','inactivo'].map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-success btn-sm" onClick={() => handleSave(s.id)}><FiSave /></button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}><FiX /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 500 }}>{s.nombre}</td>
                      <td style={{ fontSize: '0.85rem' }}>{s.correo}</td>
                      <td><span className="badge" style={{ background: 'var(--gradient-gold)', color: 'var(--primary-dark)' }}>Nivel {s.nivel_actual}</span></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: '6px', borderRadius: '3px' }}>
                            <div className="progress-bar" style={{ width: `${s.porcentaje_progreso || 0}%`, background: 'var(--gradient-gold)', borderRadius: '3px' }}></div>
                          </div>
                          <small>{s.porcentaje_progreso?.toFixed(0)}%</small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge bg-${s.estado === 'activo' ? 'success' : s.estado === 'graduado' ? 'primary' : s.estado === 'suspendido' ? 'warning' : 'danger'}`}>
                          {s.estado}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(s)}><FiEdit2 /></button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(s.id, s.nombre)}><FiTrash2 /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">No se encontraron estudiantes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'var(--gradient-primary)', color: 'var(--white)' }}>
                <h5 className="modal-title" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <FiUserPlus className="me-2" /> Nuevo Estudiante
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAdd}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" value={addForm.nombre} onChange={e => setAddForm({...addForm, nombre: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correo <span className="text-danger">*</span></label>
                    <input type="email" className="form-control" value={addForm.correo} onChange={e => setAddForm({...addForm, correo: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña <span className="text-danger">*</span></label>
                    <input type="password" className="form-control" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-control" value={addForm.telefono} onChange={e => setAddForm({...addForm, telefono: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" className="form-control" value={addForm.direccion} onChange={e => setAddForm({...addForm, direccion: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-gold" disabled={adding}>
                    {adding ? 'Creando...' : 'Crear Estudiante'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentsTable;
