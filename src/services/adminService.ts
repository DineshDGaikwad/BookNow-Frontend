import api from './api';
import { ApprovalRequest, AdminAction, AuditLog, SystemSetting, DashboardStats, ApprovalActionRequest } from '../types/admin.types';

class AdminService {
  // Approval Management
  async getPendingApprovals(): Promise<ApprovalRequest[]> {
    const response = await api.get('/admin/approvals/pending');
    return response.data;
  }

  async getApprovalById(approvalRequestId: string): Promise<ApprovalRequest> {
    const response = await api.get(`/admin/approvals/${approvalRequestId}`);
    return response.data;
  }

  async approveRequest(approvalRequestId: string, request: ApprovalActionRequest): Promise<void> {
    await api.post(`/admin/approvals/${approvalRequestId}/approve?adminId=${request.adminId}`, request.remarks);
  }

  async rejectRequest(approvalRequestId: string, request: ApprovalActionRequest): Promise<void> {
    await api.post(`/admin/approvals/${approvalRequestId}/reject?adminId=${request.adminId}`, request.remarks);
  }

  // Admin Actions
  async getActionsByAdmin(adminId: string): Promise<AdminAction[]> {
    const response = await api.get(`/admin/actions/admin/${adminId}`);
    return response.data;
  }

  async getActionsByEntity(entityId: string): Promise<AdminAction[]> {
    const response = await api.get(`/admin/actions/entity/${entityId}`);
    return response.data;
  }

  // Audit Logs
  async getLogsByEntity(entityName: string, entityId: string): Promise<AuditLog[]> {
    const response = await api.get(`/admin/audit-logs/entity/${entityName}/${entityId}`);
    return response.data;
  }

  async getLogsByActor(actorId: string): Promise<AuditLog[]> {
    const response = await api.get(`/admin/audit-logs/actor/${actorId}`);
    return response.data;
  }

  // System Settings
  async getAllSettings(): Promise<SystemSetting[]> {
    const response = await api.get('/admin/system-settings');
    return response.data;
  }

  async getSettingByKey(key: string): Promise<SystemSetting> {
    const response = await api.get(`/admin/system-settings/${key}`);
    return response.data;
  }

  async updateSetting(key: string, value: string, adminId: string): Promise<void> {
    await api.put(`/admin/system-settings/${key}?adminId=${adminId}`, value);
  }

  // Dashboard Stats (mock for now - implement when backend endpoint is available)
  async getDashboardStats(): Promise<DashboardStats> {
    // TODO: Replace with actual API call when backend endpoint is available
    return {
      pendingApprovals: 12,
      totalUsers: 1247,
      activeEvents: 89,
      totalRevenue: 125000,
      monthlyGrowth: {
        users: 24,
        events: 7,
        revenue: 15
      }
    };
  }
}

const adminService = new AdminService();
export default adminService;