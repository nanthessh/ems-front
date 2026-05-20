import api from './axios'

const unwrap = (res) => res.data?.data ?? res.data

export const announcementService = {
  getAll:   () => api.get('/announcements').then(unwrap),
  getById:  (id) => api.get(`/announcements/${id}`).then(unwrap),
  create:   (dto) => api.post('/announcements', dto),
  update:   (dto) => api.put('/announcements', dto),
  remove:   (id) => api.delete(`/announcements/${id}`),
}
