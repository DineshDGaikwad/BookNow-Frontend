import api from './api';

export interface ProfileUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  dateOfBirth?: string;
}

export const profileService = {
  updateProfile: async (userId: string, data: ProfileUpdateRequest) => {
    const response = await api.put(`/auth/user/${userId}/profile`, data);
    return response.data;
  },

  getProfile: async (userId: string) => {
    const response = await api.get(`/auth/user/${userId}/profile`);
    return response.data;
  }
};