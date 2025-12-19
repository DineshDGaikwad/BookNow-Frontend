import axios from 'axios';
import { LoginRequest, CustomerRegisterRequest, OrganizerRegisterRequest } from '../types/auth.types';
import { API_CONFIG, API_ENDPOINTS } from './apiConfig';

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  customerLogin: async (credentials: LoginRequest) => {
    const response = await api.post(API_ENDPOINTS.AUTH.CUSTOMER_LOGIN, credentials);
    return response.data;
  },

  customerRegister: async (data: CustomerRegisterRequest) => {
    const response = await api.post(API_ENDPOINTS.AUTH.CUSTOMER_REGISTER, data);
    return response.data;
  },

  organizerLogin: async (credentials: LoginRequest) => {
    const response = await api.post(API_ENDPOINTS.AUTH.ORGANIZER_LOGIN, credentials);
    return response.data;
  },

  organizerRegister: async (data: OrganizerRegisterRequest) => {
    const response = await api.post(API_ENDPOINTS.AUTH.ORGANIZER_REGISTER, data);
    return response.data;
  },

  adminLogin: async (credentials: LoginRequest) => {
    const response = await api.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return response.data;
  },

  logout: async (userId: string, refreshToken: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT, { userId, refreshToken });
    return response.data;
  },

  googleAuth: async (idToken: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE, { idToken });
    return response.data;
  },
};