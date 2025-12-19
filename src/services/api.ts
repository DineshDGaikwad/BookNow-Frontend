import { API_CONFIG, API_ENDPOINTS } from './apiConfig';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Version': '1.0',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Return mock data for demo
      return this.getMockData(endpoint) as T;
    }
  }

  private getMockData(endpoint: string): any {
    if (endpoint.includes('/events')) {
      return [
        { id: '1', title: 'Concert Night', description: 'Amazing concert', venue: { name: 'Music Hall' }, category: 'Music', date: new Date() },
        { id: '2', title: 'Theater Show', description: 'Great theater', venue: { name: 'Theater Hall' }, category: 'Theater', date: new Date() }
      ];
    }
    if (endpoint.includes('/seats')) {
      return Array.from({ length: 50 }, (_, i) => ({
        id: `seat-${i}`,
        row: String.fromCharCode(65 + Math.floor(i / 10)),
        number: (i % 10) + 1,
        category: 'Standard',
        price: 50,
        isBooked: Math.random() > 0.8,
        isLocked: false,
        isAccessible: Math.random() > 0.9
      }));
    }
    return [];
  }

  async getEvents(filters?: any) {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.request(`${API_ENDPOINTS.CUSTOMER.EVENTS}${queryParams}`);
  }

  async getEventById(id: string) {
    return this.request(API_ENDPOINTS.CUSTOMER.EVENT_DETAILS(id));
  }

  async getShowSeats(showId: string) {
    return this.request(API_ENDPOINTS.CUSTOMER.SHOW_SEATS(showId));
  }

  async lockSeats(showId: string, seatIds: string[]) {
    return this.request(API_ENDPOINTS.CUSTOMER.LOCK_SEATS, {
      method: 'POST',
      body: JSON.stringify({ 
        showId, 
        showSeatIds: seatIds, 
        sessionId: Date.now().toString() 
      }),
    });
  }

  async getSeatRecommendations(showId: string, count: number, category?: string) {
    return this.request(`/customer/seat-recommendations/${showId}/best-available`);
  }

  async createBooking(bookingData: any) {
    return this.request(API_ENDPOINTS.CUSTOMER.CREATE_BOOKING, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async startBookingTimer(showId: string, seatIds: string[]) {
    return { remainingSeconds: 900, expiresAt: new Date(Date.now() + 900000) };
  }

  async getBookingTimer(showId: string) {
    return { remainingSeconds: 900, expiresAt: new Date(Date.now() + 900000) };
  }

  async extendBookingTimer(showId: string, additionalMinutes: number = 5) {
    return true;
  }
}

export const apiService = new ApiService();
export default apiService;