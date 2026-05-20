import api from './axios'

const unwrap = (res) => res.data?.data ?? res.data

export const payrollService = {
  getAll:        (month, year) => api.get('/payroll', { params: { month, year } }).then(unwrap),
  getByEmployee: (id) => api.get(`/payroll/employee/${id}`).then(unwrap),
  getSlip:       (id) => api.get(`/payroll/slip/${id}`).then(unwrap),
  generate:      (dto) => api.post('/payroll/generate', dto),
  updateStatus:  (dto) => api.put('/payroll/status', dto),
}
