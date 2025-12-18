export { bookingService } from './mockServices';
export interface Booking { id: string; bookingId: string; eventTitle: string; showDate: string; showStartTime: string; venueName: string; seats: any[]; totalAmount: number; status: string; bookingStatus: string; }
export interface BookingRequest { eventId: string; }