import api from './api';

export interface CreateVenueRequest {
  venueName: string;
  venueAddress?: string;
  venueCity?: string;
  venueState?: string;
  venueZipcode?: string;
  venueCapacity: number;
  venueType?: string;
  venueContactInfo?: string;
}

export interface VenueResponse {
  venueId: string;
  venueName: string;
  venueAddress?: string;
  venueCity?: string;
  venueState?: string;
  venueZipcode?: string;
  venueCapacity: number;
  venueType?: string;
  venueContactInfo?: string;
  organizerId: string;
  venueStatus: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  eventCount: number;
}

export interface SeatConfiguration {
  seatType: string;
  totalSeats: number;
  activeSeats: number;
  basePrice: number;
  maxPrice: number;
}

export interface VenueSeatsResponse {
  seats: any[];
  configurations: SeatConfiguration[];
}

export interface VenueSeatConstraint {
  seatType: string;
  minPrice: number;
  maxPrice: number;
  totalSeats: number;
}

export interface CreateVenueWithSeatsRequest {
  VenueName: string;
  VenueAddress?: string;
  VenueCity?: string;
  VenueState?: string;
  VenueZipcode?: string;
  VenueContactInfo?: string;
  VenueType?: string;
  SeatConfigurations: {
    SeatType: string;
    RowsCount: number;
    SeatsPerRow: number;
    RowPrefix: string;
    BasePrice: number;
    MaxPrice: number;
  }[];
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

  updateVenue: async (venueId: string, organizerId: string, data: Partial<CreateVenueRequest>): Promise<VenueResponse> => {
    const response = await api.put(`/organizer/venues/${venueId}?organizerId=${organizerId}`, data);
    return response.data;
  },

  getApprovedVenues: async (): Promise<VenueResponse[]> => {
    const response = await api.get('/venues');
    return response.data;
  },

  getPublicVenue: async (venueId: string): Promise<VenueResponse> => {
    const response = await api.get(`/venues/${venueId}`);
    return response.data;
  },

  createVenueWithSeats: async (organizerId: string, data: CreateVenueWithSeatsRequest): Promise<VenueResponse> => {
    const response = await api.post(`/organizer/venues/create-with-seats?organizerId=${organizerId}`, data);
    return response.data;
  },

  getVenueSeats: async (venueId: string, organizerId: string): Promise<VenueSeatsResponse> => {
    const response = await api.get(`/organizer/venues/${venueId}/seats?organizerId=${organizerId}`);
    return response.data;
  },

  updateSeatPricing: async (venueId: string, organizerId: string, data: any): Promise<any> => {
    const response = await api.put(`/organizer/venues/${venueId}/seat-pricing?organizerId=${organizerId}`, data);
    return response.data;
  },

  updateSeatStatus: async (venueId: string, organizerId: string, data: any): Promise<any> => {
    const response = await api.put(`/organizer/venues/${venueId}/seat-status?organizerId=${organizerId}`, data);
    return response.data;
  },

  deleteVenue: async (venueId: string, organizerId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/organizer/venues/${venueId}?organizerId=${organizerId}`);
    return response.data;
  },

  toggleVenueStatus: async (venueId: string, organizerId: string): Promise<{ message: string }> => {
    const response = await api.patch(`/organizer/venues/${venueId}/toggle-status?organizerId=${organizerId}`);
    return response.data;
  },

  getVenueSeatConfigurations: async (venueId: string): Promise<VenueSeatConstraint[]> => {
    const response = await api.get(`/organizer/shows/venue/${venueId}/seat-configurations`);
    return response.data;
  },

  updateSeatLayout: async (venueId: string, organizerId: string, data: {
    seatType: string;
    rowsCount: number;
    seatsPerRow: number;
    basePrice: number;
    maxPrice: number;
  }): Promise<VenueSeatsResponse> => {
    const response = await api.put(`/organizer/venues/${venueId}/seat-layout?organizerId=${organizerId}`, data);
    return response.data;
  }
};