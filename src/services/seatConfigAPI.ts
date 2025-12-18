import api from './api';

export interface VenueSeatConfiguration {
  seatType: string;
  totalSeats: number;
  minPrice: number;
  maxPrice: number;
}

export const seatConfigAPI = {
  getVenueSeatConfigurations: async (venueId: string): Promise<VenueSeatConfiguration[]> => {
    const response = await api.get(`/organizer/shows/venue/${venueId}/seat-configurations`);
    return response.data;
  }
};