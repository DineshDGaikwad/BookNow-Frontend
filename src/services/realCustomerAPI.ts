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
  priceMax?: number;
  averageRating?: number;
  reviewCount?: number;
  shows?: any[];
  seatTypes?: SeatTypeInfo[];
}

export interface SeatTypeInfo {
  seatType: string;
  basePrice: number;
  maxPrice: number;
  totalSeats: number;
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
  basePrice?: number;
  maxPrice?: number;
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

// Global cache to prevent duplicate calls
let eventsCache: { data: CustomerEvent[], timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let ongoingRequest: Promise<CustomerEvent[]> | null = null;

export const customerAPI = {
  // Get events using customer flow endpoint
  getEvents: async (params: SearchEventsParams = {}): Promise<CustomerEvent[]> => {
    // Return cached data if fresh and no search params
    if (eventsCache && Date.now() - eventsCache.timestamp < CACHE_DURATION && !params.search) {
      return eventsCache.data;
    }

    // Return ongoing request if exists
    if (ongoingRequest) {
      return ongoingRequest;
    }

    ongoingRequest = (async () => {
      try {
        const response = await api.get('/customer/flow/events', {
          params: {
            search: params.search,
            category: params.category !== 'All' ? params.category : undefined,
            city: params.city !== 'All Cities' ? params.city : undefined,
            page: params.page || 1,
            pageSize: params.pageSize || params.limit || 50
          }
        });
        
        const events = response.data.Events || response.data.events || response.data || [];
        
        // Cache only if no search params
        if (!params.search) {
          eventsCache = { data: events, timestamp: Date.now() };
        }
        
        return events;
      } catch (error: any) {
        console.error('Failed to fetch events:', error);
        throw error;
      } finally {
        ongoingRequest = null;
      }
    })();

    return ongoingRequest;
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

  // Get featured events from cache
  getFeaturedEvents: async (limit: number = 6): Promise<CustomerEvent[]> => {
    const events = await customerAPI.getEvents({});
    return events.slice(0, limit);
  },

  // Get event by slug (no ID exposure)
  getEventBySlug: async (slug: string): Promise<CustomerEvent> => {
    // First check cache
    if (eventsCache) {
      const cached = eventsCache.data.find(e => 
        e.eventTitle.toLowerCase().replace(/\s+/g, '-') === slug
      );
      if (cached) return cached;
    }

    try {
      const response = await api.post('/events/by-slug', { slug });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch event:', error);
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

  // Show operations with tokens (no ID exposure)
  getShowSeatsByToken: async (showToken: string) => {
    try {
      const response = await api.post('/seats/for-show', { showToken });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch show seats:', error);
      throw error;
    }
  },

  // Seat operations with tokens
  selectSeatByToken: async (seatToken: string) => {
    try {
      const response = await api.post('/seats/select', { seatToken });
      return response.data;
    } catch (error) {
      console.error('Failed to select seat:', error);
      throw error;
    }
  },

  deselectSeatByToken: async (seatToken: string) => {
    try {
      const response = await api.post('/seats/deselect', { seatToken });
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

  // Validate seats with tokens
  validateSeatsByTokens: async (seatTokens: string[]) => {
    try {
      const response = await api.post('/seats/validate', { seatTokens });
      return response.data;
    } catch (error) {
      console.error('Failed to validate seats:', error);
      return { isValid: false, message: 'Failed to validate seats' };
    }
  },

  // Get event details using customer flow endpoint
  getEventDetails: async (eventId: string, includeReviews: boolean = false): Promise<CustomerEvent> => {
    if (eventsCache) {
      const cached = eventsCache.data.find(e => e.eventId === eventId);
      if (cached) return cached;
    }
    
    try {
      const response = await api.get(`/customer/flow/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      throw error;
    }
  },

  // Get show details
  getShowDetails: async (showId: string): Promise<ShowDetails> => {
    try {
      const response = await api.get(`/customer/shows/${showId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch show details:', error);
      throw error;
    }
  },

  // Get show seats using customer flow endpoint
  getShowSeats: async (showId: string, page: number = 1, pageSize: number = 200) => {
    try {
      const response = await api.get(`/customer/flow/shows/${showId}/seats`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch show seats:', error);
      throw error;
    }
  },

  // Seat operations using real-time endpoints
  selectSeat: async (showSeatId: string, userId: string) => {
    try {
      const response = await api.post(`/customer/realtime-seats/${showSeatId}/select`);
      return response.data;
    } catch (error) {
      console.error('Failed to select seat:', error);
      throw error;
    }
  },

  deselectSeat: async (showSeatId: string, userId: string) => {
    try {
      const response = await api.post(`/customer/realtime-seats/${showSeatId}/deselect`);
      return response.data;
    } catch (error) {
      console.error('Failed to deselect seat:', error);
      throw error;
    }
  },

  // Validate seats using checkout endpoint
  validateSeats: async (userId: string, seatIds: string[]) => {
    try {
      const response = await api.post('/customer/checkout/validate-seats', { userId, seatIds });
      return response.data;
    } catch (error) {
      console.error('Failed to validate seats:', error);
      return { isValid: false, message: 'Failed to validate seats' };
    }
  },

  // Clear cache
  clearCache: () => {
    eventsCache = null;
  }
};

export default customerAPI;