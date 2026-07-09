import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const studentAPI = {
  getDashboard: () => api.get('/students/dashboard'),
};

export const paymentAPI = {
  getPayments: () => api.get('/payments'),
  createPayment: (data) => api.post('/payments', data),
};

export const progressAPI = {
  getProgress: () => api.get('/progress'),
};

export const attendanceAPI = {
  getMyAttendance: () => api.get('/attendance'),
  markMyAttendance: (data) => api.post('/attendance', data),
  getMyStats: () => api.get('/attendance/stats'),
};

export const adminAPI = {
  getStudents: () => api.get('/admin/students'),
  createStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getPayments: () => api.get('/admin/payments'),
  updatePayment: (id, data) => api.put(`/admin/payments/${id}`, data),
  getStats: () => api.get('/admin/stats'),
  updateProgress: (studentId, data) => api.put(`/admin/progress/${studentId}`, data),
  getAttendance: (estudianteId) => api.get(`/admin/attendance${estudianteId ? `?estudiante_id=${estudianteId}` : ''}`),
  markAttendance: (data) => api.post('/admin/attendance', data),
  getAttendanceStats: (id) => api.get(`/admin/attendance/stats/${id}`),
};

export default api;
