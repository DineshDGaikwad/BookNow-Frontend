import api from './api';
import { AuthResponse, LoginRequest, CustomerRegisterRequest, OrganizerRegisterRequest } from '../types/auth.types';

export const authService = {
  // Customer Authentication
  customerLogin: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/customer/login', credentials);
    return response.data;
  },

  customerRegister: async (data: CustomerRegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/customer/register', data);
    return response.data;
  },

  // Organizer Authentication
  organizerLogin: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/organizer/login', credentials);
    return response.data;
  },

  organizerRegister: async (data: OrganizerRegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/organizer/register', data);
    return response.data;
  },

  // Admin Authentication
  adminLogin: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },

  // Common
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (userId: string, refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { userId, refreshToken });
  },

  // Google Authentication (Customer only)
  googleAuth: async (idToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/customer/google', { idToken });
    return response.data;
  }
};