export { venueAPI } from './mockServices';
export interface VenueResponse { venueId: string; organizerId: string; venueStatus: number; venueName: string; venueAddress: string; venueCity: string; venueState?: string; venueCapacity: number; venueType?: string; isActive: boolean; createdAt: string; }
export interface CreateVenueRequest { venueName: string; venueAddress: string; venueCity: string; venueState: string; venueZipcode: string; venueCapacity: number; venueContactInfo: string; }
export interface CreateVenueWithSeatsRequest { name: string; seats: any[]; }
export interface VenueSeatsResponse { seats: any[]; configurations: any[]; }
export interface VenueSeatConstraint { seatType: string; minPrice: number; maxPrice: number; totalSeats: number; }
export interface VenueSeatConfiguration { seatType: string; minPrice: number; maxPrice: number; totalSeats: number; }