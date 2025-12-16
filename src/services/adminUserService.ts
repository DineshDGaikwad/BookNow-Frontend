import api from './api';
import { AdminUser, PaginatedUsers } from '../types/admin.types';

class AdminUserService {
  async getAllUsers(page: number = 1, pageSize: number = 10, role?: string, status?: string): Promise<PaginatedUsers> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });
    
    if (role) params.append('role', role);
    if (status) params.append('status', status);
    
    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  }

  async getUserById(userId: string): Promise<AdminUser> {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  }

  async updateUserStatus(userId: string, status: string, adminId: string): Promise<void> {
    await api.put(`/admin/users/${userId}/status`, {
      status,
      adminId
    });
  }

  async deleteUser(userId: string, adminId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}?adminId=${adminId}`);
  }
}

const adminUserService = new AdminUserService();
export default adminUserService;