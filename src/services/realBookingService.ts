import axios from 'axios';

const API_BASE_URL = 'http://localhost:5089/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Booking {
  bookingId: string;
  eventTitle: string;
  showStartTime: string;
  venueName: string;
  seats: { seatNumber: string; seatType: string; price: number }[];
  totalAmount: number;
  bookingStatus: string;
  createdAt: string;
}

export const bookingService = {
  getUserBookings: async (): Promise<Booking[]> => {
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').userId;
      if (!userId) throw new Error('User not found');
      
      const [upcoming, past] = await Promise.all([
        api.get(`/customer/bookings/users/${userId}/upcoming`),
        api.get(`/customer/bookings/users/${userId}/past`)
      ]);
      
      return [...(upcoming.data || []), ...(past.data || [])];
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      return [];
    }
  },

  createBooking: async (bookingData: {
    showId: string;
    seatIds: string[];
    totalAmount: number;
  }): Promise<{ bookingId: string; success: boolean }> => {
    try {
      const response = await api.post('/customer/flow/booking/create', bookingData);
      return response.data;
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  },

  getBookingDetails: async (bookingId: string): Promise<Booking> => {
    try {
      const response = await api.get(`/customer/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
      throw error;
    }
  },

  initializeBookingFlow: async (showId: string, seatIds: string[]) => {
    try {
      const response = await api.post('/customer/booking-flow/initialize', { showId, seatIds });
      return response.data;
    } catch (error) {
      console.error('Failed to initialize booking flow:', error);
      throw error;
    }
  },

  lockSeats: async (showId: string, seatIds: string[]) => {
    try {
      const response = await api.post('/customer/booking-flow/lock-seats', { showId, seatIds });
      return response.data;
    } catch (error) {
      console.error('Failed to lock seats:', error);
      throw error;
    }
  },

  processPayment: async (paymentData: any) => {
    try {
      const response = await api.post('/customer/booking-flow/process-payment', paymentData);
      return response.data;
    } catch (error) {
      console.error('Failed to process payment:', error);
      throw error;
    }
  },

  completeBooking: async (bookingId: string) => {
    try {
      const response = await api.post('/customer/booking-flow/complete', { bookingId });
      return response.data;
    } catch (error) {
      console.error('Failed to complete booking:', error);
      throw error;
    }
  }
};