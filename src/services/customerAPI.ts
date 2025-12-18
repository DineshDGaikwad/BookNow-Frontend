import api from './api';

export interface CustomerEvent {
  eventId: string;
  eventTitle: string;
  eventDescription?: string;
  eventCategory: string;
  eventGenre?: string;
  posterUrl?: string;
  venueId: string;
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
  venueCapacity?: number;
  eventStatus: number;
  createdAt?: string;
  priceMin?: number;
  priceMax?: number;
  nextShowDate?: string;
  showCount?: number;
  shows?: CustomerShow[];
  averageRating?: number;
  reviewCount?: number;
}

export interface CustomerShow {
  showId: string;
  showStartTime: string;
  showEndTime: string;
  showLanguage?: string;
  showFormat?: string;
  showPriceMin?: number;
  showPriceMax?: number;
  showStatus: number;
  availableSeats: number;
  totalSeats: number;
  venueName?: string;
  venueCity?: string;
}

export interface ShowDetails extends CustomerShow {
  eventId: string;
  eventTitle: string;
  eventDescription?: string;
  posterUrl?: string;
  venueName: string;
  venueCapacity?: number;
}

export interface SeatInfo {
  seatId: string;
  seatNumber: string;
  row?: string;
  seatRowNumber?: string;
  section?: string;
  seatType?: string;
  price?: number;
  seatPrice?: number;
  status: 'Available' | 'Booked' | 'Locked' | 'Selected';
  lockedBy?: string;
  lockedUntil?: string;
  showSeatId?: string;
}

export interface SeatMap {
  showId: string;
  seats: SeatInfo[];
  sections: string[];
  rows: string[];
  totalSeats: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  priceCategories: Record<string, number>;
}

export interface EventReview {
  reviewId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const customerAPI = {
  // Events with caching
  getEvents: async (params?: { category?: string; search?: string; city?: string; limit?: number }): Promise<CustomerEvent[]> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.city) searchParams.append('city', params.city);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await api.get(`/customer/events?${searchParams}`);
    return response.data;
  },

  getFeaturedEvents: async (limit: number = 6): Promise<CustomerEvent[]> => {
    const response = await api.get(`/customer/events?limit=${limit}&featured=true`);
    return response.data;
  },

  getEventDetails: async (eventId: string, includeReviews = false): Promise<CustomerEvent> => {
    const url = `/customer/events/${eventId}?includeReviews=${includeReviews}&_t=${Date.now()}`;
    const response = await api.get(url);
    // Handle wrapped response when includeReviews=true
    return includeReviews && response.data.event ? response.data.event : response.data;
  },

  getEventReviews: async (eventId: string): Promise<EventReview[]> => {
    const response = await api.get(`/customer/events/${eventId}/reviews`);
    return response.data;
  },

  // Shows
  getShowDetails: async (showId: string, includeSeats = false): Promise<ShowDetails> => {
    const response = await api.get(`/customer/shows/${showId}?includeSeats=${includeSeats}`);
    return response.data;
  },

  getShowSeats: async (showId: string, page: number = 1, pageSize: number = 50): Promise<SeatMap> => {
    const response = await api.get(`/customer/shows/${showId}/seats?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  // Real-time seat operations
  selectSeat: async (showSeatId: string, userId: string): Promise<SeatInfo> => {
    const response = await api.post(`/customer/realtime-seats/${showSeatId}/select?userId=${userId}`);
    return response.data;
  },

  deselectSeat: async (showSeatId: string, userId: string): Promise<SeatInfo> => {
    const response = await api.post(`/customer/realtime-seats/${showSeatId}/deselect?userId=${userId}`);
    return response.data;
  },

  getRealTimeSeatStatus: async (showId: string): Promise<SeatInfo[]> => {
    const response = await api.get(`/customer/realtime-seats/show/${showId}/status`);
    return response.data;
  },

  releaseUserSelection: async (userId: string, showId: string): Promise<void> => {
    await api.post(`/customer/realtime-seats/release-selection?userId=${userId}&showId=${showId}`);
  },

  // Checkout validation
  validateSeats: async (userId: string, showSeatIds: string[]): Promise<{ isValid: boolean; message: string }> => {
    const response = await api.post('/customer/checkout/validate-seats', {
      userId,
      showSeatIds
    });
    return response.data;
  }
};