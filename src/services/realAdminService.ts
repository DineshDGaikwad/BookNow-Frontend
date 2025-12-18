import axios from 'axios';

const API_BASE_URL = 'http://localhost:5089/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getRecentActions: async () => {
    const response = await api.get('/admin/dashboard/recent-actions');
    return response.data;
  },

  getUserAnalytics: async () => {
    const response = await api.get('/admin/dashboard/user-analytics');
    return response.data;
  },

  // Events Management
  getAllEvents: async () => {
    const response = await api.get('/admin/events');
    return response.data;
  },

  getEventById: async (eventId: string) => {
    const response = await api.get(`/admin/events/${eventId}`);
    return response.data;
  },

  getEventShows: async (eventId: string) => {
    const response = await api.get(`/admin/events/${eventId}/shows`);
    return response.data;
  },

  getEventBookings: async (eventId: string) => {
    const response = await api.get(`/admin/events/${eventId}/bookings`);
    return response.data;
  },

  // Bookings Management
  getAllBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  getBookingById: async (bookingId: string) => {
    const response = await api.get(`/admin/bookings/${bookingId}`);
    return response.data;
  },

  // Users Management
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

  // Venues Management
  getAllVenues: async () => {
    const response = await api.get('/admin/venues');
    return response.data;
  },

  getPendingVenues: async () => {
    const response = await api.get('/admin/venues/pending');
    return response.data;
  },

  getVenueById: async (venueId: string) => {
    const response = await api.get(`/admin/venues/${venueId}`);
    return response.data;
  },

  approveVenue: async (venueId: string) => {
    const response = await api.put(`/admin/venues/${venueId}/approve`);
    return response.data;
  },

  rejectVenue: async (venueId: string, rejectionReason: string) => {
    const response = await api.put(`/admin/venues/${venueId}/reject`, { rejectionReason });
    return response.data;
  },

  updateVenue: async (venueId: string, data: any) => {
    const response = await api.put(`/admin/venues/${venueId}`, data);
    return response.data;
  },

  deleteVenue: async (venueId: string) => {
    const response = await api.delete(`/admin/venues/${venueId}`);
    return response.data;
  },

  // Approvals Management
  getPendingApprovals: async () => {
    const response = await api.get('/admin/approvals/pending');
    return response.data;
  },

  getApprovalById: async (approvalId: string) => {
    const response = await api.get(`/admin/approvals/${approvalId}`);
    return response.data;
  },

  approveRequest: async (approvalId: string, request: { adminId: string; remarks?: string }) => {
    const response = await api.post(`/admin/approvals/${approvalId}/approve?adminId=${request.adminId}`, request.remarks || '');
    return response.data;
  },

  rejectRequest: async (approvalId: string, request: { adminId: string; remarks: string }) => {
    const response = await api.post(`/admin/approvals/${approvalId}/reject?adminId=${request.adminId}`, request.remarks);
    return response.data;
  },

  // System Settings
  getAllSettings: async () => {
    const response = await api.get('/admin/system-settings');
    return response.data;
  },

  getSettingByKey: async (key: string) => {
    const response = await api.get(`/admin/system-settings/${key}`);
    return response.data;
  },

  updateSetting: async (key: string, value: string, adminId: string) => {
    const response = await api.put(`/admin/system-settings/${key}?adminId=${adminId}`, value);
    return response.data;
  },

  // Audit Logs
  getAuditLogs: async (page = 1, pageSize = 50, entityType?: string, userId?: string) => {
    const params = new URLSearchParams({ 
      page: page.toString(), 
      pageSize: pageSize.toString() 
    });
    if (entityType) params.append('entityType', entityType);
    if (userId) params.append('userId', userId);
    
    const response = await api.get(`/admin/audit-logs?${params}`);
    return response.data;
  },

  // Admin Actions
  getActionsByAdmin: async (adminId: string) => {
    const response = await api.get(`/admin/actions/admin/${adminId}`);
    return response.data;
  },

  getActionsByEntity: async (entityId: string) => {
    const response = await api.get(`/admin/actions/entity/${entityId}`);
    return response.data;
  },
};

export default adminService;