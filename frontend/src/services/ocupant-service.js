import { apiService } from "./api-services";


export const ocupantService = {
  getAllPaginate: (page = 1, search = "") => apiService.get(`/ocupant?page=${page}&search=${search}`),
  getAll: async () => {
    const response = await apiService.get('/ocupant/all');
    return response;
  },
  getByHomeId: (home_id) => apiService.get(`/ocupant/home/${home_id}`),
};