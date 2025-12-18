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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface CustomerEvent {
  id: string;
  eventId: string;
  title: string;
  eventTitle: string;
  eventDescription?: string;
  eventCategory: string;
  eventGenre?: string;
  posterUrl?: string;
  venueName?: string;
  venueCity?: string;
  venueAddress?: string;
  venueCapacity?: number;
  nextShowDate?: string;
  priceMin?: number;
  averageRating?: number;
  reviewCount?: number;
  shows?: any[];
}

export interface SeatInfo {
  id: string;
  seatId: string;
  showSeatId?: string;
  status: string;
  lockedBy?: string;
  section?: string;
  seatType?: string;
  seatPrice?: number;
  price?: number;
  row?: string;
  seatRowNumber?: string;
  seatNumber?: string;
}

export interface ShowDetails {
  id: string;
  title: string;
  eventId?: string;
  eventTitle?: string;
  showStartTime?: string;
  venueName?: string;
}

export interface SearchEventsParams {
  search?: string;
  category?: string;
  genre?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  limit?: number;
}

export const customerAPI = {
  // Get events with search and filters
  getEvents: async (params: SearchEventsParams = {}): Promise<CustomerEvent[]> => {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('SearchTerm', params.search);
      if (params.category && params.category !== 'All') searchParams.append('Category', params.category);
      if (params.genre) searchParams.append('Genre', params.genre);
      if (params.city && params.city !== 'All Cities') searchParams.append('City', params.city);
      if (params.startDate) searchParams.append('StartDate', params.startDate);
      if (params.endDate) searchParams.append('EndDate', params.endDate);
      if (params.minPrice) searchParams.append('MinPrice', params.minPrice.toString());
      if (params.maxPrice) searchParams.append('MaxPrice', params.maxPrice.toString());
      
      searchParams.append('Page', (params.page || 1).toString());
      searchParams.append('PageSize', (params.pageSize || params.limit || 20).toString());

      const response = await api.get(`/customer/events?${searchParams}`);
      
      // Handle different response structures
      if (response.data.Events) {
        return response.data.Events;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return response.data.events || [];
      }
    } catch (error: any) {
      console.error('Failed to fetch events:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Backend server is not running. Please start the backend server at http://localhost:5089');
      }
      throw error;
    }
  },

  // Get all events
  getAllEvents: async (): Promise<CustomerEvent[]> => {
    try {
      const response = await api.get('/customer/events/all');
      return response.data.Events || response.data.events || response.data || [];
    } catch (error) {
      console.error('Failed to fetch all events:', error);
      throw error;
    }
  },

  // Get featured events
  getFeaturedEvents: async (limit: number = 6): Promise<CustomerEvent[]> => {
    try {
      const response = await api.get(`/customer/events?PageSize=${limit}`);
      const events = response.data.Events || response.data.events || response.data || [];
      return events.slice(0, limit);
    } catch (error: any) {
      console.error('Failed to fetch featured events:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error('Backend server is not running. Please start the backend server at http://localhost:5089');
      }
      throw error;
    }
  },

  // Get event details by ID
  getEventDetails: async (eventId: string, includeReviews: boolean = false): Promise<CustomerEvent> => {
    try {
      const response = await api.get(`/customer/events/${eventId}?includeReviews=${includeReviews}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      throw error;
    }
  },

  // Get event by ID (alias for getEventDetails)
  getEventById: async (eventId: string, includeReviews: boolean = false): Promise<CustomerEvent> => {
    return customerAPI.getEventDetails(eventId, includeReviews);
  },

  // Get event reviews
  getEventReviews: async (eventId: string) => {
    try {
      const response = await api.get(`/customer/events/${eventId}/reviews`);
      return response.data.Reviews || response.data.reviews || response.data || [];
    } catch (error) {
      console.error('Failed to fetch event reviews:', error);
      throw error;
    }
  },

  // Get recommended events (requires authentication)
  getRecommendedEvents: async (userId: string): Promise<CustomerEvent[]> => {
    try {
      const response = await api.get('/customer/events/recommended');
      return response.data.Events || response.data.events || response.data || [];
    } catch (error) {
      console.error('Failed to fetch recommended events:', error);
      throw error;
    }
  },

  // Show-related endpoints
  getShowDetails: async (showId: string): Promise<ShowDetails> => {
    try {
      const response = await api.get(`/customer/shows/${showId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch show details:', error);
      throw error;
    }
  },

  getShowSeats: async (showId: string, page: number = 1, pageSize: number = 200) => {
    try {
      const response = await api.get(`/customer/seats/${showId}?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch show seats:', error);
      throw error;
    }
  },

  // Seat selection endpoints
  selectSeat: async (seatId: string, userId: string) => {
    try {
      const response = await api.post(`/customer/seats/${seatId}/select`, { userId });
      return response.data;
    } catch (error) {
      console.error('Failed to select seat:', error);
      throw error;
    }
  },

  deselectSeat: async (seatId: string, userId: string) => {
    try {
      const response = await api.post(`/customer/seats/${seatId}/deselect`, { userId });
      return response.data;
    } catch (error) {
      console.error('Failed to deselect seat:', error);
      throw error;
    }
  },

  // Real-time seat status
  getRealTimeSeatStatus: async (showId: string) => {
    try {
      const response = await api.get(`/customer/seats/${showId}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch real-time seat status:', error);
      throw error;
    }
  },

  // Release user selections
  releaseUserSelection: async (userId: string, showId: string) => {
    try {
      const response = await api.post(`/customer/seats/release`, { userId, showId });
      return response.data;
    } catch (error) {
      console.error('Failed to release user selection:', error);
      throw error;
    }
  },

  // Validate seats before checkout
  validateSeats: async (userId: string, seatIds: string[]) => {
    try {
      const response = await api.post('/customer/seats/validate', { userId, seatIds });
      return response.data;
    } catch (error) {
      console.error('Failed to validate seats:', error);
      return { isValid: false, message: 'Failed to validate seats' };
    }
  }
};

export default customerAPI;