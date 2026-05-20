import api from './axios'

const unwrap = (res) => res.data?.data ?? res.data

export const leaveService = {
  getTypes:      () => api.get('/leave/types').then(unwrap),
  getAll:        (status) => api.get('/leave', { params: { status } }).then(unwrap),
  getByEmployee: (id) => api.get(`/leave/employee/${id}`).then(unwrap),
  getBalance:    (id, year) => api.get(`/leave/balance/${id}`, { params: { year } }).then(unwrap),
  apply:         (dto) => api.post('/leave/apply', dto),
  updateStatus:  (dto) => api.put('/leave/status', dto),
  remove:        (id) => api.delete(`/leave/${id}`),
}
