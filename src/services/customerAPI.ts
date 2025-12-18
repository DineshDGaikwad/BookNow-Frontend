export { customerAPI } from './realCustomerAPI';
export type { CustomerEvent, SeatInfo, ShowDetails } from './realCustomerAPI';
export interface SeatMap { seats: any[]; }
export interface CustomerShow { showId: string; showStartTime: string; }
export interface EventReview { id: string; rating: number; }