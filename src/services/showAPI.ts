export { showAPI } from './mockServices';
export interface ShowResponse { showId: string; eventId: string; venueId: string; venueName: string; showStartTime: string; showEndTime: string; showLanguage?: string; showFormat?: string; showStatus: number; availableSeats?: number; totalSeats?: number; seatPricing?: any[]; }
export interface CreateShowRequest { eventId: string; venueId: string; showStartTime: string; showEndTime: string; showLanguage: string; showFormat: string; }
export interface CreateShowWithSeatPricingRequest { eventId: string; venueId: string; showStartTime: string; showEndTime: string; showLanguage: string; showFormat: string; seatPricing: any[]; }
export interface SeatPricingRequest { seatType: string; price: number; }
export interface UpdateShowRequest { title: string; }
export interface UpdatePricingRequest { pricing: any[]; }