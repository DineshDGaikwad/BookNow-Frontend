import api from './api';

export interface CreateShowRequest {
  eventId: string;
  venueId: string;
  showStartTime: string;
  showEndTime: string;
  showLanguage?: string;
  showFormat?: string;
  showPriceMin?: number;
  showPriceMax?: number;
}

export interface ShowResponse {
  showId: string;
  eventId: string;
  venueId: string;
  venueName: string;
  eventTitle?: string;
  showStartTime: string;
  showEndTime: string;
  showLanguage?: string;
  showFormat?: string;
  showPriceMin?: number;
  showPriceMax?: number;
  showStatus: number;
  createdAt: string;
  updatedAt?: string;
  availableSeats: number;
  totalSeats: number;
}

export interface UpdateShowRequest {
  showStartTime?: string;
  showEndTime?: string;
  showLanguage?: string;
  showFormat?: string;
}

export interface UpdatePricingRequest {
  showPriceMin?: number;
  showPriceMax?: number;
}

export const showAPI = {
  createShow: async (organizerId: string, data: CreateShowRequest): Promise<ShowResponse> => {
    const response = await api.post(`/organizer/shows?organizerId=${organizerId}`, data);
    return response.data;
  },

  getEventShows: async (eventId: string, organizerId: string): Promise<ShowResponse[]> => {
    const response = await api.get(`/organizer/shows?eventId=${eventId}&organizerId=${organizerId}`);
    return response.data;
  },

  getShow: async (showId: string, organizerId: string): Promise<ShowResponse> => {
    const response = await api.get(`/organizer/shows/${showId}?organizerId=${organizerId}`);
    return response.data;
  },

  updateShow: async (showId: string, organizerId: string, data: UpdateShowRequest): Promise<ShowResponse> => {
    const response = await api.put(`/organizer/shows/${showId}?organizerId=${organizerId}`, data);
    return response.data;
  },

  updatePricing: async (showId: string, organizerId: string, data: UpdatePricingRequest): Promise<ShowResponse> => {
    const response = await api.put(`/organizer/shows/${showId}/pricing?organizerId=${organizerId}`, data);
    return response.data;
  },

  deleteShow: async (showId: string, organizerId: string): Promise<void> => {
    await api.delete(`/organizer/shows/${showId}?organizerId=${organizerId}`);
  }
};