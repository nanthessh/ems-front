import api from './axios'

const unwrap = (res) => res.data?.data ?? res.data

export const employeeService = {
  getAll:    () => api.get('/employees').then(unwrap),
  getById:   (id) => api.get(`/employees/${id}`).then(unwrap),
  getStats:  () => api.get('/employees/stats').then(unwrap),
  create:    (dto) => api.post('/employees', dto),
  update:    (dto) => api.put('/employees', dto),
  remove:    (id) => api.delete(`/employees/${id}`),
}
