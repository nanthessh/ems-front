import api from './axios'

const unwrap = (res) => res.data?.data ?? res.data

export const departmentService = {
  getAll:   () => api.get('/departments').then(unwrap),
  getById:  (id) => api.get(`/departments/${id}`).then(unwrap),
  create:   (dto) => api.post('/departments', dto),
  update:   (dto) => api.put('/departments', dto),
  remove:   (id) => api.delete(`/departments/${id}`),
}
