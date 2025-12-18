export { customerAPI } from './mockServices';
export interface CustomerEvent { id: string; eventId: string; title: string; eventTitle: string; eventDescription?: string; eventCategory: string; eventGenre?: string; posterUrl?: string; venueName?: string; venueCity?: string; venueAddress?: string; venueCapacity?: number; nextShowDate?: string; priceMin?: number; averageRating?: number; reviewCount?: number; shows?: any[]; }
export interface SeatInfo { id: string; seatId: string; showSeatId?: string; status: string; lockedBy?: string; section?: string; seatType?: string; seatPrice?: number; price?: number; row?: string; seatRowNumber?: string; seatNumber?: string; }
export interface SeatMap { seats: any[]; }
export interface ShowDetails { id: string; title: string; eventId?: string; eventTitle?: string; showStartTime?: string; venueName?: string; }
export interface CustomerShow { showId: string; showStartTime: string; }
export interface EventReview { id: string; rating: number; }