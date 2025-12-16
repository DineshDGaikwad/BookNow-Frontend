export interface Event {
  eventId: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  venue: Venue;
  organizer: string;
  status: 'Draft' | 'Published' | 'Cancelled';
  imageUrl?: string;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface Venue {
  venueId: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  facilities: string[];
}

export interface Show {
  showId: string;
  eventId: string;
  showDate: string;
  showTime: string;
  availableSeats: number;
  totalSeats: number;
  priceMin: number;
  priceMax: number;
}

export interface Seat {
  seatId: string;
  seatNumber: string;
  row: string;
  section: string;
  price: number;
  status: 'Available' | 'Booked' | 'Locked';
}