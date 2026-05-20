import api from './axios'

const unwrap = (res) => res.data?.data ?? res.data

export const attendanceService = {
  getAll:       (month, year) => api.get('/attendance', { params: { month, year } }).then(unwrap),
  getToday:     () => api.get('/attendance/today').then(unwrap),
  getByEmployee:(id, month, year) => api.get(`/attendance/employee/${id}`, { params: { month, year } }).then(unwrap),
  getSummary:   (id, month, year) => api.get(`/attendance/summary/${id}`, { params: { month, year } }).then(unwrap),
  checkIn:      (dto) => api.post('/attendance/checkin', dto),
  checkOut:     (id) => api.put(`/attendance/checkout/${id}`),
}
