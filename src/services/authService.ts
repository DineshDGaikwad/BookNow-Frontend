import axios from 'axios';
import { LoginRequest, CustomerRegisterRequest, OrganizerRegisterRequest } from '../types/auth.types';

const API_BASE_URL = 'http://localhost:5089/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  customerLogin: async (credentials: LoginRequest) => {
    const response = await api.post('/auth/customer/login', credentials);
    return response.data;
  },

  customerRegister: async (data: CustomerRegisterRequest) => {
    const response = await api.post('/auth/customer/register', data);
    return response.data;
  },

  organizerLogin: async (credentials: LoginRequest) => {
    const response = await api.post('/auth/organizer/login', credentials);
    return response.data;
  },

  organizerRegister: async (data: OrganizerRegisterRequest) => {
    const response = await api.post('/auth/organizer/register', data);
    return response.data;
  },

  adminLogin: async (credentials: LoginRequest) => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  logout: async (userId: string, refreshToken: string) => {
    const response = await api.post('/auth/logout', { userId, refreshToken });
    return response.data;
  },

  googleAuth: async (idToken: string) => {
    const response = await api.post('/auth/google', { idToken });
    return response.data;
  },
};