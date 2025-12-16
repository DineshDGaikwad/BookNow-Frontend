import api from './api';

export interface CreateVenueRequest {
  venueName: string;
  venueAddress?: string;
  venueCity?: string;
  venueState?: string;
  venueZipcode?: string;
  venueCapacity: number;
  venueContactInfo?: string;
  defaultPriceMin?: number;
  defaultPriceMax?: number;
}

export interface VenueResponse {
  venueId: string;
  venueName: string;
  venueAddress?: string;
  venueCity?: string;
  venueState?: string;
  venueZipcode?: string;
  venueCapacity: number;
  venueContactInfo?: string;
  defaultPriceMin?: number;
  defaultPriceMax?: number;
  organizerId: string;
  venueStatus: number;
  createdAt: string;
  updatedAt?: string;
  eventCount: number;
}

export const venueAPI = {
  createVenue: async (organizerId: string, data: CreateVenueRequest): Promise<VenueResponse> => {
    const response = await api.post(`/organizer/venues?organizerId=${organizerId}`, data);
    return response.data;
  },

  getVenues: async (organizerId: string): Promise<VenueResponse[]> => {
    const response = await api.get(`/organizer/venues?organizerId=${organizerId}`);
    return response.data;
  },

  getVenue: async (venueId: string, organizerId: string): Promise<VenueResponse> => {
    const response = await api.get(`/organizer/venues/${venueId}?organizerId=${organizerId}`);
    return response.data;
  },

  getApprovedVenues: async (): Promise<VenueResponse[]> => {
    const response = await api.get('/venues');
    return response.data;
  }
};