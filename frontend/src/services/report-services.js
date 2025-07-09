import { apiService } from "./api-services";

export const reportService = {
  getMonthlySummary: async (filters) => {
    const queryParams = new URLSearchParams({
      month: filters.month,
      year: filters.year,
    }).toString();

    const response = await apiService.get(`/report?${queryParams}`);
    return response;
  },
  getMonthlyDetail: async (filters) => {
    const queryParams = new URLSearchParams({
        month: filters.month,
        year: filters.year,
      }).toString();
    const response = await apiService.get(`/report/month?${queryParams}`);
    return response;
  },
};
