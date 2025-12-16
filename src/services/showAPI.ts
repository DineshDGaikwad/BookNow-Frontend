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
  showStartTime: string;
  showEndTime: string;
  showLanguage?: string;
  showFormat?: string;
  showPriceMin?: number;
  showPriceMax?: number;
  showStatus: number;
  createdAt: string;
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

  deleteShow: async (showId: string, organizerId: string): Promise<void> => {
    await api.delete(`/organizer/shows/${showId}?organizerId=${organizerId}`);
  }
};