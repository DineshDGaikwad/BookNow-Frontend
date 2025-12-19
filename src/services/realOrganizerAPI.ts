import axios from 'axios';
import { API_CONFIG } from './apiConfig';

// Request deduplication and caching
const pendingRequests = new Map<string, Promise<any>>();
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to create request key for deduplication
const createRequestKey = (config: any) => {
  return `${config.method?.toUpperCase()}-${config.url}-${JSON.stringify(config.params || {})}`;
};

// Add auth token to requests and handle deduplication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add request deduplication for GET requests
  if (config.method?.toLowerCase() === 'get') {
    const requestKey = createRequestKey(config);
    if (pendingRequests.has(requestKey)) {
      // Return existing promise for duplicate request
      return pendingRequests.get(requestKey)!.then(() => config);
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors and cleanup
api.interceptors.response.use(
  (response) => {
    // Clean up pending request
    if (response.config.method?.toLowerCase() === 'get') {
      const requestKey = createRequestKey(response.config);
      pendingRequests.delete(requestKey);
    }
    return response;
  },
  (error) => {
    // Clean up pending request on error
    if (error.config?.method?.toLowerCase() === 'get') {
      const requestKey = createRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }
    
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timeout:', error.config?.url);
    }
    return Promise.reject(error);
  }
);



export const realOrganizerAPI = {
  // Events
  createEvent: async (organizerId: string, data: any) => {
    const response = await api.post(`/organizer/events?organizerId=${organizerId}`, data);
    return response.data;
  },

  getEvents: async (organizerId: string) => {
    const response = await api.get(`/organizer/events?organizerId=${organizerId}`);
    return response.data;
  },

  getEvent: async (eventId: string, organizerId: string) => {
    const response = await api.get(`/organizer/events/${eventId}?organizerId=${organizerId}`);
    return response.data;
  },

  updateEvent: async (eventId: string, organizerId: string, data: any) => {
    const response = await api.put(`/organizer/events/${eventId}?organizerId=${organizerId}`, data);
    return response.data;
  },

  deleteEvent: async (eventId: string, organizerId: string) => {
    await api.delete(`/organizer/events/${eventId}?organizerId=${organizerId}`);
  },

  // Venues
  createVenue: async (organizerId: string, data: any) => {
    const response = await api.post(`/organizer/venues?organizerId=${organizerId}`, data);
    return response.data;
  },

  createVenueWithSeats: async (organizerId: string, data: any) => {
    const response = await api.post(`/organizer/venues/create-with-seats?organizerId=${organizerId}`, data);
    return response.data;
  },

  getVenues: async (organizerId: string) => {
    const requestKey = `GET-/organizer/venues-${organizerId}`;
    
    // Check cache first
    const cached = responseCache.get(requestKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    // Check if request is already pending
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }
    
    // Create new request
    const requestPromise = api.get(`/organizer/venues?organizerId=${organizerId}`)
      .then(response => {
        const data = response.data;
        responseCache.set(requestKey, { data, timestamp: Date.now() });
        return data;
      })
      .finally(() => pendingRequests.delete(requestKey));
    
    pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  },

  getVenue: async (venueId: string, organizerId: string) => {
    const response = await api.get(`/organizer/venues/${venueId}?organizerId=${organizerId}`);
    return response.data;
  },

  updateVenue: async (venueId: string, organizerId: string, data: any) => {
    const response = await api.put(`/organizer/venues/${venueId}?organizerId=${organizerId}`, data);
    return response.data;
  },

  deleteVenue: async (venueId: string, organizerId: string) => {
    const response = await api.delete(`/organizer/venues/${venueId}?organizerId=${organizerId}`);
    return response.data;
  },

  getVenueSeats: async (venueId: string, organizerId: string) => {
    const response = await api.get(`/organizer/venues/${venueId}/seats?organizerId=${organizerId}`);
    return response.data;
  },

  // Shows
  createShow: async (organizerId: string, data: any) => {
    const response = await api.post(`/organizer/shows?organizerId=${organizerId}`, data);
    return response.data;
  },

  createShowWithSeatPricing: async (organizerId: string, data: any) => {
    const response = await api.post(`/organizer/shows/with-seat-pricing?organizerId=${organizerId}`, data);
    return response.data;
  },

  getShows: async (organizerId: string, eventId?: string) => {
    const params = new URLSearchParams({ organizerId });
    if (eventId) params.append('eventId', eventId);
    const response = await api.get(`/organizer/shows?${params.toString()}`);
    return response.data;
  },

  getShow: async (showId: string, organizerId: string) => {
    const response = await api.get(`/organizer/shows/${showId}?organizerId=${organizerId}`);
    return response.data;
  },

  updateShow: async (showId: string, organizerId: string, data: any) => {
    const response = await api.put(`/organizer/shows/${showId}?organizerId=${organizerId}`, data);
    return response.data;
  },

  deleteShow: async (showId: string, organizerId: string) => {
    await api.delete(`/organizer/shows/${showId}?organizerId=${organizerId}`);
  },

  getVenueSeatConfigurations: async (venueId: string) => {
    const response = await api.get(`/organizer/shows/venue/${venueId}/seat-configurations`);
    return response.data;
  },

  getVenueFormData: async (venueId: string, organizerId: string) => {
    const response = await api.get(`/organizer/venues/${venueId}/form-data?organizerId=${organizerId}`);
    return response.data;
  },

  // Dashboard
  getDashboard: async (organizerId: string) => {
    const response = await api.get(`/organizer/dashboard/summary?organizerId=${organizerId}`);
    return response.data;
  },

  getAllEvents: async () => {
    const response = await api.get('/organizer/events/all');
    return response.data;
  },
};

export default realOrganizerAPI;