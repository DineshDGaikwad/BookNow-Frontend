export interface CustomerEvent {
  eventId: string;
  eventTitle: string;
  eventDescription?: string;
  eventCategory: string;
  eventGenre?: string;
  posterUrl?: string;
  organizerId: string;
  organizerName: string;
  eventStatus: number;
  createdAt: string;
  showCount: number;
  upcomingShows: CustomerShow[];
}

export interface CustomerShow {
  showId: string;
  eventId: string;
  venueId: string;
  venueName: string;
  venueCity: string;
  showStartTime: string;
  showEndTime: string;
  showLanguage?: string;
  showFormat?: string;
  showPriceMin?: number;
  showPriceMax?: number;
  availableSeats: number;
  totalSeats: number;
}

export interface ShowDetails extends CustomerShow {
  eventTitle: string;
  eventDescription?: string;
  posterUrl?: string;
  venueAddress?: string;
  seats: SeatInfo[];
}

export interface SeatInfo {
  seatId: string;
  seatNumber: string;
  row: string;
  section: string;
  price: number;
  status: 'Available' | 'Booked' | 'Locked';
}

export const customerAPI = {
  getEvents: async (category?: string, search?: string): Promise<CustomerEvent[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const response = await fetch(`http://localhost:5089/api/customer/events?${params}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  getEventDetails: async (eventId: string): Promise<CustomerEvent> => {
    const response = await fetch(`http://localhost:5089/api/customer/events/${eventId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  getShowDetails: async (showId: string): Promise<ShowDetails> => {
    const response = await fetch(`http://localhost:5089/api/customer/shows/${showId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  getShowSeats: async (showId: string): Promise<SeatInfo[]> => {
    const response = await fetch(`http://localhost:5089/api/customer/shows/${showId}/seats`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
};