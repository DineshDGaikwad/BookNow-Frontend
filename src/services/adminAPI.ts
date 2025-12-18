export { adminAPI } from './mockServices';
export interface AdminVenueResponse { id: string; venueId: string; name: string; venueName: string; venueAddress: string; venueCity: string; venueState: string; venueCapacity: number; venueContactInfo: string; venueStatus: string; createdBy: string; createdAt: string; }
export interface UpdateVenueRequest { venueName: string; venueAddress: string; venueCity: string; venueState: string; venueCapacity: number; venueContactInfo: string; }
export interface VenueApprovalRequest { reason: string; }