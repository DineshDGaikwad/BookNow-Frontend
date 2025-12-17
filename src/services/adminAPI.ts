import api from './api';

export interface AdminVenueResponse {
  venueId: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  venueCapacity: number;
  venueStatus: string;
  createdBy: string;
  createdAt: string;
}

export interface UpdateVenueRequest {
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  venueCapacity: number;
  venueContactInfo?: string;
}

export interface VenueApprovalRequest {
  rejectionReason?: string;
}

export const adminAPI = {
  // Venue Management
  getAllVenues: async (): Promise<AdminVenueResponse[]> => {
    const response = await api.get('/admin/venues');
    return response.data;
  },

  getPendingVenues: async (): Promise<AdminVenueResponse[]> => {
    const response = await api.get('/admin/venues/pending');
    return response.data;
  },

  getVenueById: async (venueId: string): Promise<AdminVenueResponse> => {
    const response = await api.get(`/admin/venues/${venueId}`);
    return response.data;
  },

  updateVenue: async (venueId: string, data: UpdateVenueRequest): Promise<AdminVenueResponse> => {
    const response = await api.put(`/admin/venues/${venueId}`, data);
    return response.data;
  },

  deleteVenue: async (venueId: string): Promise<void> => {
    await api.delete(`/admin/venues/${venueId}`);
  },

  approveVenue: async (venueId: string): Promise<AdminVenueResponse> => {
    const response = await api.put(`/admin/venues/${venueId}/approve`);
    return response.data;
  },

  rejectVenue: async (venueId: string, data: VenueApprovalRequest): Promise<AdminVenueResponse> => {
    const response = await api.put(`/admin/venues/${venueId}/reject`, data);
    return response.data;
  }
};