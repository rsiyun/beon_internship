import { apiService } from "./api-services";

export const expenseService = {
    getAllPaginate: (page = 1, search = "") => apiService.get(`/expense?page=${page}&search=${search}`),
    create: (data) => apiService.post('/expense', data),
    update: (id, data) => apiService.put(`/expense/${id}`, data),
}