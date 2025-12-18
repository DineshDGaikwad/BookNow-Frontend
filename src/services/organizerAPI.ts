import api from './api';

export interface OrganizerDashboard {
  totalEvents: number;
  totalShows: number;
  totalTicketsSold: number;
  totalRevenue: number;
  recentEvents: EventSummary[];
  upcomingShows: ShowSummary[];
}

export interface EventSummary {
  eventId: string;
  eventTitle: string;
  eventStatus: string;
  showCount: number;
  ticketsSold: number;
  revenue: number;
  createdAt: string;
}

export interface ShowSummary {
  showId: string;
  eventTitle: string;
  showStartTime: string;
  venueName: string;
  ticketsSold: number;
  revenue: number;
}

export interface CreateEventRequest {
  eventTitle: string;
  eventDescription?: string;
  eventCategory: string;
  eventGenre?: string;
  venueId?: string;
  posterUrl?: string;
}

export interface VenueResponse {
  venueId: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  venueCapacity: number;
  venueType: string;
  venueStatus: string;
}

export interface EventResponse {
  eventId: string;
  eventTitle: string;
  eventDescription?: string;
  eventCategory: string;
  eventGenre?: string;
  posterUrl?: string;
  organizerId: string;
  eventStatus: string;
  createdAt: string;
  showCount: number;
}

export const organizerAPI = {
  getDashboard: async (organizerId: string): Promise<OrganizerDashboard> => {
    const response = await api.get(`/organizer/dashboard/summary?organizerId=${organizerId}`);
    return response.data;
  },

  getEvents: async (organizerId: string): Promise<EventResponse[]> => {
    const response = await api.get(`/organizer/events?organizerId=${organizerId}`);
    return response.data;
  },

  createEvent: async (organizerId: string, data: CreateEventRequest): Promise<EventResponse> => {
    const response = await api.post(`/organizer/events?organizerId=${organizerId}`, data);
    return response.data;
  },

  getEvent: async (eventId: string, organizerId: string): Promise<EventResponse> => {
    const response = await api.get(`/organizer/events/${eventId}?organizerId=${organizerId}`);
    return response.data;
  },

  updateEvent: async (eventId: string, organizerId: string, data: Partial<CreateEventRequest>): Promise<EventResponse> => {
    const response = await api.put(`/organizer/events/${eventId}?organizerId=${organizerId}`, data);
    return response.data;
  },

  deleteEvent: async (eventId: string, organizerId: string): Promise<void> => {
    await api.delete(`/organizer/events/${eventId}?organizerId=${organizerId}`);
  },

  getVenues: async (organizerId: string): Promise<VenueResponse[]> => {
    const response = await api.get(`/organizer/venues?organizerId=${organizerId}`);
    return response.data;
  }
};