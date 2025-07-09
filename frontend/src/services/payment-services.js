import { apiService } from "./api-services";


export const paymentService = {
  getAllPaginate: async (filters) => {
    const queryParams = new URLSearchParams({
      page: filters.page,
      search: filters.search,
      dues_type_id: filters.dues_type_id === "all" ? "" : filters.dues_type_id,
      month: filters.month,
      status: filters.status === "all" ? "" : filters.status,
      year: filters.year,
    }).toString();

    const response = await apiService.get(`/payment?${queryParams}`);
    return response;
  },
  create: (data) => apiService.post('/payment', data),
  update: (id, data) => apiService.put(`/payment/${id}`, data),
};