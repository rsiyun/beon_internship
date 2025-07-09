import axios from '@/lib/axios';

const handleResponse = (response) => response.data;

const handleError = (error) => {
  const message = error.response?.data?.message || 'Terjadi kesalahan';
  throw new Error(message);
};

export const apiService = {
  get: async (url) => {
    try {
      const response = await axios.get(url);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  post: async (url, data) => {
    try {
      const response = await axios.post(url, data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  put: async (url, data) => {
    try {
      const response = await axios.put(url, data);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
  
  patch: async (url, data) => {
    try{
      const response = await axios.patch(url, data);
      return handleResponse(response);
    }catch (error) {
      return handleError(error);
    }
  },

  delete: async (url) => {
    try {
      const response = await axios.delete(url);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
};