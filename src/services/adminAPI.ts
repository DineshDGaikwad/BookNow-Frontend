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

export interface AdminVenueResponse { 
  venueId: string; 
  venueName: string; 
  venueAddress: string; 
  venueCity: string; 
  venueState: string; 
  venueCapacity: number; 
  venueContactInfo?: string; 
  venueStatus: number; 
  createdBy: string; 
  createdAt: string; 
}

export interface UpdateVenueRequest { 
  venueName: string; 
  venueAddress: string; 
  venueCity: string; 
  venueState: string; 
  venueCapacity: number; 
  venueContactInfo: string; 
}

export interface VenueApprovalRequest { 
  rejectionReason?: string; 
}

export const adminAPI = {
  getAllVenues: async (): Promise<AdminVenueResponse[]> => {
    const response = await api.get('/admin/venues');
    return response.data;
  },

  getPendingVenues: async (): Promise<AdminVenueResponse[]> => {
    const response = await api.get('/admin/venues/pending');
    return response.data;
  },

  getVenueById: async (venueId: string): Promise<AdminVenueResponse | null> => {
    const response = await api.get(`/admin/venues/${venueId}`);
    return response.data;
  },

  updateVenue: async (venueId: string, data: UpdateVenueRequest): Promise<AdminVenueResponse | null> => {
    const response = await api.put(`/admin/venues/${venueId}`, data);
    return response.data;
  },

  deleteVenue: async (venueId: string): Promise<void> => {
    await api.delete(`/admin/venues/${venueId}`);
  },

  approveVenue: async (venueId: string): Promise<AdminVenueResponse | null> => {
    const response = await api.put(`/admin/venues/${venueId}/approve`);
    return response.data;
  },

  rejectVenue: async (venueId: string, data: VenueApprovalRequest): Promise<AdminVenueResponse | null> => {
    const response = await api.put(`/admin/venues/${venueId}/reject`, data);
    return response.data;
  },

  getAuditLogs: async (filters: any): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.entityType) params.append('entityType', filters.entityType);
    if (filters.userId) params.append('userId', filters.userId);
    
    const response = await api.get(`/admin/audit-logs?${params}`);
    return response.data;
  },
};