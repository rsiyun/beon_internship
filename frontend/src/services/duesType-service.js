import { apiService } from "./api-services";

export const duesTypeService = {
  getAllPaginate: (page = 1, search = "") => apiService.get(`/dues-type?page=${page}&search=${search}`),
  getAll: () => apiService.get('/dues-type/all'),
  create: (data) => apiService.post('/dues-type', data),
  update: (id, data) => apiService.put(`/dues-type/${id}`, data),
};