import axios from 'axios';

const API_BASE_URL = 'http://localhost:5089/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminUserService = {
  getAllUsers: async (page = 1, pageSize = 10, role?: string, status?: string) => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      pageSize: pageSize.toString() 
    });
    if (role) params.append('role', role);
    if (status) params.append('status', status);
    
    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string, adminId: string) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status, adminId });
    return response.data;
  },

  deleteUser: async (userId: string, adminId: string) => {
    const response = await api.delete(`/admin/users/${userId}?adminId=${adminId}`);
    return response.data;
  },
};

export default adminUserService;