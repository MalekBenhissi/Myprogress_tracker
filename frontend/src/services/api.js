import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const goalsAPI = {
  getAll: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  create: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  update: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  toggleStep: async (goalId, stepId) => {
    const response = await api.put(`/goals/${goalId}/step/${stepId}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

export default api;