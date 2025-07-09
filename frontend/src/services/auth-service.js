import { apiService } from "./api-services";


export const authService = {
  login: async (credentials) => {
    const response = await apiService.post('/login', credentials)
    return response;
  },
};