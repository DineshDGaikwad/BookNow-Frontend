// Fallback data when backend is unavailable
export const fallbackEvents = [
  {
    eventId: 'event_1',
    eventTitle: 'Rock Concert Night',
    eventDescription: 'Amazing rock concert with top artists',
    eventCategory: 'Music',
    eventGenre: 'Rock',
    posterUrl: '/api/placeholder/400/300',
    venueName: 'Music Arena',
    venueCity: 'Mumbai',
    nextShowDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priceMin: 500,
    averageRating: 4.5,
    reviewCount: 120
  },
  {
    eventId: 'event_2',
    eventTitle: 'Comedy Show',
    eventDescription: 'Hilarious stand-up comedy show',
    eventCategory: 'Comedy',
    eventGenre: 'Stand-up',
    posterUrl: '/api/placeholder/400/300',
    venueName: 'Comedy Club',
    venueCity: 'Delhi',
    nextShowDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priceMin: 300,
    averageRating: 4.2,
    reviewCount: 85
  }
];

export const fallbackVenues = [
  {
    venueId: 'venue_1',
    organizerId: 'org_1',
    venueStatus: 1,
    venueName: 'Grand Theater',
    venueAddress: '123 Main Street',
    venueCity: 'Mumbai',
    venueState: 'Maharashtra',
    venueCapacity: 500,
    venueType: 'Theater',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    venueId: 'venue_2',
    organizerId: 'org_2',
    venueStatus: 1,
    venueName: 'Sports Stadium',
    venueAddress: '456 Stadium Road',
    venueCity: 'Delhi',
    venueState: 'Delhi',
    venueCapacity: 10000,
    venueType: 'Stadium',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const fallbackDashboard = {
  totalEvents: 3,
  totalShows: 8,
  totalTicketsSold: 150,
  totalRevenue: 75000,
  recentEvents: [],
  upcomingShows: []
};