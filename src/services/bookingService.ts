import api from './api';

export interface BookingRequest {
  userId: string;
  showId: string;
  selectedSeats: string[];
  totalAmount: number;
  paymentMethod: string;
  contactDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface Booking {
  bookingId: string;
  userId: string;
  showId: string;
  eventTitle: string;
  venueName: string;
  showStartTime: string;
  totalAmount: number;
  bookingStatus: string;
  seats: Array<{
    seatNumber: string;
    seatPrice: number;
  }>;
  createdAt: string;
}

export const bookingService = {
  createBooking: async (bookingData: BookingRequest) => {
    const response = await api.post('/customer/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async (userId: string) => {
    const response = await api.get(`/customer/bookings/user/${userId}`);
    return response.data;
  },

  getBookingDetails: async (bookingId: string) => {
    const response = await api.get(`/customer/bookings/${bookingId}`);
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.post(`/customer/bookings/${bookingId}/cancel`);
    return response.data;
  }
};