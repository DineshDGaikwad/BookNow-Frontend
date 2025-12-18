import api from './api';
import { ApprovalRequest, AdminAction, AuditLog, SystemSetting, DashboardStats, ApprovalActionRequest, UserAnalytics } from '../types/admin.types';

class AdminService {
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

  async getActionsByAdmin(adminId: string): Promise<AdminAction[]> {
    const response = await api.get(`/admin/actions/admin/${adminId}`);
    return response.data;
  }

  async getActionsByEntity(entityId: string): Promise<AdminAction[]> {
    const response = await api.get(`/admin/actions/entity/${entityId}`);
    return response.data;
  }

  async getLogsByEntity(entityName: string, entityId: string): Promise<AuditLog[]> {
    const response = await api.get(`/admin/audit-logs/entity/${entityName}/${entityId}`);
    return response.data;
  }

  async getLogsByActor(actorId: string): Promise<AuditLog[]> {
    const response = await api.get(`/admin/audit-logs/actor/${actorId}`);
    return response.data;
  }

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

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/admin/dashboard/stats');
    return {
      pendingApprovals: response.data.pendingApprovals,
      totalUsers: response.data.totalUsers,
      organizerUsers: response.data.organizerUsers,
      customerUsers: response.data.customerUsers,
      activeEvents: response.data.activeEvents,
      totalRevenue: response.data.totalRevenue,
      totalBookings: response.data.totalBookings
    };
  }

  async getRecentActions(): Promise<AdminAction[]> {
    const response = await api.get('/admin/dashboard/recent-actions');
    return response.data;
  }

  async getUserAnalytics(): Promise<UserAnalytics> {
    const response = await api.get('/admin/dashboard/user-analytics');
    return response.data;
  }

  async getAllEvents(): Promise<any[]> {
    const response = await api.get('/admin/events');
    return response.data;
  }

  async getEventById(eventId: string): Promise<any> {
    const response = await api.get(`/admin/events/${eventId}`);
    return response.data;
  }

  async getEventShows(eventId: string): Promise<any[]> {
    const response = await api.get(`/admin/events/${eventId}/shows`);
    return response.data;
  }

  async getEventBookings(eventId: string): Promise<any[]> {
    const response = await api.get(`/admin/events/${eventId}/bookings`);
    return response.data;
  }

  async getAllBookings(): Promise<any[]> {
    const response = await api.get('/admin/bookings');
    return response.data;
  }

  async getBookingById(bookingId: string): Promise<any> {
    const response = await api.get(`/admin/bookings/${bookingId}`);
    return response.data;
  }
}

const adminService = new AdminService();
export default adminService;