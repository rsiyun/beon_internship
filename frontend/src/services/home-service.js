
import { apiService } from "./api-services";

export const homeService = {
  getAllPaginate: (page = 1, search = "") => apiService.get(`/house?page=${page}&search=${search}`),
  getAll:  () => apiService.get('/house/all'),
  getById: (id) => apiService.get(`/house/${id}`),
  create: (data) => apiService.post('/house', data),
  update: (id, data) => apiService.put(`/house/${id}`, data),
  addResident: (id, data) => apiService.post(`/house/${id}/ocupant`, data),
  removeResident: (id, data) => apiService.patch(`/house/${id}/ocupant`, data),
};