// Mock services to prevent compilation errors
export const adminService = {
  getPendingApprovals: async () => [],
  getApprovalById: async (id: string) => null,
  approveRequest: async (id: string, request: any) => {},
  rejectRequest: async (id: string, request: any) => {},
  getActionsByAdmin: async (id: string) => [],
  getActionsByEntity: async (id: string) => [],
  getLogsByEntity: async (name: string, id: string) => [],
  getLogsByActor: async (id: string) => [],
  getAllSettings: async () => [],
  getSettingByKey: async (key: string) => null,
  updateSetting: async (key: string, value: string, adminId: string) => {},
  getDashboardStats: async () => ({ pendingApprovals: 0, totalUsers: 0, organizerUsers: 0, customerUsers: 0, activeEvents: 0, totalBookings: 0, totalRevenue: 0 }),
  getRecentActions: async () => [],
  getUserAnalytics: async () => ({ usersByType: [], monthlyRegistrations: [] }),
  getAllEvents: async () => [],
  getEventById: async (id: string) => null,
  getEventShows: async (id: string) => [],
  getEventBookings: async (id: string) => [],
  getAllBookings: async () => [],
  getBookingById: async (id: string) => null
};

export const adminAPI = {
  getAllVenues: async () => [],
  getPendingVenues: async () => [],
  getVenueById: async (id: string) => null,
  updateVenue: async (id: string, data: any) => null,
  deleteVenue: async (id: string) => {},
  approveVenue: async (id: string) => null,
  rejectVenue: async (id: string, data: any) => null,
  getAuditLogs: async (filters: any) => []
};

export const adminUserService = {
  getAllUsers: async (page?: number, pageSize?: number, role?: string, status?: string) => ({ users: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0 }),
  getUserById: async (id: string) => null,
  updateUserStatus: async (id: string, status: string, adminId: string) => {},
  deleteUser: async (id: string, adminId: string) => {}
};

export const authService = {
  customerLogin: async (credentials: any) => ({
    userId: 'customer_123',
    email: credentials.email || 'customer@example.com',
    name: 'Customer User',
    accessToken: 'mock_token_123',
    refreshToken: 'mock_refresh_123',
    profileCompleted: true
  }),
  customerRegister: async (data: any) => ({
    userId: 'customer_456',
    email: data.email || 'newcustomer@example.com',
    name: data.name || 'New Customer',
    accessToken: 'mock_token_456',
    refreshToken: 'mock_refresh_456',
    profileCompleted: false
  }),
  organizerLogin: async (credentials: any) => ({
    userId: 'organizer_123',
    email: credentials.email || 'organizer@example.com',
    name: 'Organizer User',
    accessToken: 'mock_token_789',
    refreshToken: 'mock_refresh_789',
    profileCompleted: true
  }),
  organizerRegister: async (data: any) => ({
    userId: 'organizer_456',
    email: data.email || 'neworganizer@example.com',
    name: data.name || 'New Organizer',
    accessToken: 'mock_token_101',
    refreshToken: 'mock_refresh_101',
    profileCompleted: false
  }),
  adminLogin: async (credentials: any) => ({
    userId: 'admin_123',
    email: credentials.email || 'admin@example.com',
    name: 'Admin User',
    accessToken: 'mock_token_admin',
    refreshToken: 'mock_refresh_admin',
    profileCompleted: true
  }),
  refreshToken: async (token: string) => ({ data: null }),
  logout: async (userId: string, refreshToken: string) => {},
  googleAuth: async (idToken: string) => ({
    userId: 'google_user_123',
    email: 'googleuser@example.com',
    name: 'Google User',
    accessToken: 'mock_google_token',
    refreshToken: 'mock_google_refresh',
    profileCompleted: true
  })
};

export const bookingService = {
  createBooking: async (data: any) => ({ data: null }),
  getUserBookings: async (userId: string) => [{
    id: 'booking_123',
    bookingId: 'booking_123',
    eventTitle: 'Sample Event',
    showDate: new Date().toISOString(),
    showStartTime: new Date().toISOString(),
    venueName: 'Sample Venue',
    seats: [{ seatNumber: 'A1' }],
    totalAmount: 1000,
    status: 'Confirmed',
    bookingStatus: 'Confirmed'
  }],
  getBookingDetails: async (id: string) => ({
    id: id,
    bookingId: id,
    eventTitle: 'Sample Event',
    showDate: new Date().toISOString(),
    showStartTime: new Date().toISOString(),
    venueName: 'Sample Venue',
    seats: [{ seatNumber: 'A1' }],
    totalAmount: 1000,
    status: 'Confirmed',
    bookingStatus: 'Confirmed'
  }),
  cancelBooking: async (id: string) => ({ data: null })
};

export const customerAPI = {
  getEvents: async (filters?: any) => [{
    id: 'event_123',
    eventId: 'event_123',
    title: 'Sample Event',
    eventTitle: 'Sample Event',
    eventDescription: 'Sample event description',
    eventCategory: 'Concert',
    eventGenre: 'Rock',
    posterUrl: '/api/placeholder/400/300',
    venueName: 'Sample Venue',
    venueCity: 'Sample City',
    venueAddress: '123 Sample Street',
    venueCapacity: 1000,
    nextShowDate: new Date().toISOString(),
    priceMin: 500,
    averageRating: 4.5,
    reviewCount: 100,
    shows: [{ showId: 'show_123' }]
  }],
  getFeaturedEvents: async (limit?: number) => [],
  getEventById: async (id: string, includeReviews?: boolean) => ({
    id: id,
    eventId: id,
    title: 'Sample Event',
    eventTitle: 'Sample Event',
    eventDescription: 'Sample event description',
    eventCategory: 'Concert',
    eventGenre: 'Rock',
    posterUrl: '/api/placeholder/400/300',
    venueName: 'Sample Venue',
    venueCity: 'Sample City',
    venueAddress: '123 Sample Street',
    venueCapacity: 1000,
    nextShowDate: new Date().toISOString(),
    priceMin: 500,
    averageRating: 4.5,
    reviewCount: 100,
    shows: [{ showId: 'show_123' }]
  }),
  getEventDetails: async (id: string, includeReviews?: boolean) => ({
    id: id,
    eventId: id,
    title: 'Sample Event',
    eventTitle: 'Sample Event',
    eventDescription: 'Sample event description',
    eventCategory: 'Concert',
    eventGenre: 'Rock',
    posterUrl: '/api/placeholder/400/300',
    venueName: 'Sample Venue',
    venueCity: 'Sample City',
    venueAddress: '123 Sample Street',
    venueCapacity: 1000,
    nextShowDate: new Date().toISOString(),
    priceMin: 500,
    averageRating: 4.5,
    reviewCount: 100,
    shows: [{ showId: 'show_123' }]
  }),
  getEventReviews: async (id: string) => [],
  getShowDetails: async (id: string, includeSeats?: boolean) => ({
    id: id,
    title: 'Sample Show',
    eventId: 'event_123',
    eventTitle: 'Sample Event',
    showStartTime: new Date().toISOString(),
    venueName: 'Sample Venue'
  }),
  getShowSeats: async (id: string, page?: number, pageSize?: number) => ({ seats: [], currentPage: page || 1, totalPages: 1 }),
  selectSeat: async (seatId: string, userId: string) => null,
  deselectSeat: async (seatId: string, userId: string) => null,
  getRealTimeSeatStatus: async (showId: string) => [],
  releaseUserSelection: async (userId: string, showId: string) => {},
  validateSeats: async (userId: string, seatIds: string[]) => ({ isValid: true, message: '' })
};

export const organizerAPI = {
  getDashboard: async (id: string) => ({
    recentEvents: [],
    upcomingShows: [],
    totalEvents: 5,
    totalShows: 12,
    totalTicketsSold: 150,
    totalRevenue: 75000
  }),
  getEvents: async (id: string) => [{
    eventId: 'event_123',
    eventTitle: 'Sample Event',
    eventDescription: 'Sample event description',
    eventCategory: 'Concert',
    eventGenre: 'Rock',
    posterUrl: '/api/placeholder/400/300',
    eventStatus: 1,
    showCount: 3,
    organizerId: id,
    organizerName: 'Sample Organizer',
    createdAt: new Date().toISOString()
  }],
  getAllEvents: async () => [{
    eventId: 'event_123',
    eventTitle: 'Sample Event',
    eventDescription: 'Sample event description',
    eventCategory: 'Concert',
    eventGenre: 'Rock',
    posterUrl: '/api/placeholder/400/300',
    eventStatus: 1,
    showCount: 3,
    organizerId: 'organizer_123',
    organizerName: 'Sample Organizer',
    createdAt: new Date().toISOString()
  }],
  createEvent: async (id: string, data: any) => null,
  getEvent: async (eventId: string, organizerId: string) => ({
    eventId: eventId,
    eventTitle: 'Sample Event',
    eventDescription: 'Sample event description',
    eventCategory: 'Concert',
    eventGenre: 'Rock',
    posterUrl: '/api/placeholder/400/300',
    eventStatus: 1,
    showCount: 3,
    organizerId: organizerId,
    organizerName: 'Sample Organizer',
    createdAt: new Date().toISOString()
  }),
  updateEvent: async (eventId: string, organizerId: string, data: any) => null,
  deleteEvent: async (eventId: string, organizerId: string) => {},
  getVenues: async (id: string) => [{
    venueId: 'venue_123',
    organizerId: id,
    venueStatus: 1,
    venueName: 'Sample Venue',
    venueAddress: '123 Sample Street',
    venueCity: 'Sample City',
    venueState: 'Sample State',
    venueCapacity: 1000,
    venueType: 'Theater',
    isActive: true,
    createdAt: new Date().toISOString()
  }]
};

export const profileService = {
  updateProfile: async (userId: string, data: any) => ({ data: null }),
  getProfile: async (userId: string) => ({ data: null })
};

export const seatConfigAPI = {
  getVenueSeatConfigurations: async (venueId: string) => [{
    seatType: 'Regular',
    minPrice: 500,
    maxPrice: 1000,
    totalSeats: 800
  }, {
    seatType: 'Premium',
    minPrice: 1000,
    maxPrice: 2000,
    totalSeats: 150
  }, {
    seatType: 'VIP',
    minPrice: 2000,
    maxPrice: 5000,
    totalSeats: 50
  }]
};

export const showAPI = {
  createShow: async (organizerId: string, data: any) => null,
  createShowWithSeatPricing: async (organizerId: string, data: any) => null,
  getEventShows: async (eventId: string, organizerId: string) => [{
    showId: 'show_123',
    eventId: eventId,
    venueId: 'venue_123',
    venueName: 'Sample Venue',
    showStartTime: new Date().toISOString(),
    showEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    showLanguage: 'English',
    showFormat: '2D',
    showStatus: 1,
    availableSeats: 800,
    totalSeats: 1000,
    seatPricing: []
  }],
  getShow: async (showId: string, organizerId: string) => ({
    showId: showId,
    eventId: 'event_123',
    venueId: 'venue_123',
    venueName: 'Sample Venue',
    showStartTime: new Date().toISOString(),
    showEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    showLanguage: 'English',
    showFormat: '2D',
    showStatus: 1,
    availableSeats: 800,
    totalSeats: 1000,
    seatPricing: []
  }),
  updateShow: async (showId: string, organizerId: string, data: any) => null,
  updatePricing: async (showId: string, organizerId: string, data: any) => null,
  deleteShow: async (showId: string, organizerId: string) => {}
};

export const venueAPI = {
  createVenue: async (organizerId: string, data: any) => null,
  getVenues: async (organizerId: string) => [{
    venueId: 'venue_123',
    organizerId: organizerId,
    venueStatus: 1,
    venueName: 'Sample Venue',
    venueAddress: '123 Sample Street',
    venueCity: 'Sample City',
    venueState: 'Sample State',
    venueCapacity: 1000,
    venueType: 'Theater',
    isActive: true,
    createdAt: new Date().toISOString()
  }],
  getVenue: async (venueId: string, organizerId: string) => ({
    venueId: venueId,
    organizerId: organizerId,
    venueStatus: 1,
    venueName: 'Sample Venue',
    venueAddress: '123 Sample Street',
    venueCity: 'Sample City',
    venueState: 'Sample State',
    venueCapacity: 1000,
    venueType: 'Theater',
    isActive: true,
    createdAt: new Date().toISOString()
  }),
  updateVenue: async (venueId: string, organizerId: string, data: any) => null,
  getApprovedVenues: async () => [{
    venueId: 'venue_123',
    organizerId: 'organizer_123',
    venueStatus: 1,
    venueName: 'Sample Venue',
    venueAddress: '123 Sample Street',
    venueCity: 'Sample City',
    venueState: 'Sample State',
    venueCapacity: 1000,
    venueType: 'Theater',
    isActive: true,
    createdAt: new Date().toISOString()
  }],
  getPublicVenue: async (venueId: string) => null,
  createVenueWithSeats: async (organizerId: string, data: any) => null,
  getVenueSeats: async (venueId: string, organizerId: string) => ({ 
    seats: [], 
    configurations: [{
      seatType: 'Regular',
      basePrice: 500,
      maxPrice: 1000,
      totalSeats: 800,
      activeSeats: 800,
      rowsCount: 20,
      seatsPerRow: 40
    }, {
      seatType: 'Premium',
      basePrice: 1000,
      maxPrice: 2000,
      totalSeats: 150,
      activeSeats: 150,
      rowsCount: 5,
      seatsPerRow: 30
    }, {
      seatType: 'VIP',
      basePrice: 2000,
      maxPrice: 5000,
      totalSeats: 50,
      activeSeats: 50,
      rowsCount: 2,
      seatsPerRow: 25
    }] 
  }),
  updateSeatPricing: async (venueId: string, organizerId: string, data: any) => null,
  updateSeatStatus: async (venueId: string, organizerId: string, data: any) => null,
  deleteVenue: async (venueId: string, organizerId: string) => ({ message: '' }),
  toggleVenueStatus: async (venueId: string, organizerId: string) => ({ message: '' }),
  getVenueSeatConfigurations: async (venueId: string) => [{
    seatType: 'Regular',
    minPrice: 500,
    maxPrice: 1000,
    totalSeats: 800
  }, {
    seatType: 'Premium',
    minPrice: 1000,
    maxPrice: 2000,
    totalSeats: 150
  }, {
    seatType: 'VIP',
    minPrice: 2000,
    maxPrice: 5000,
    totalSeats: 50
  }],
  updateSeatLayout: async (venueId: string, organizerId: string, data: any) => ({
    seats: [],
    configurations: [{
      seatType: data.seatType || 'Regular',
      basePrice: data.basePrice || 500,
      maxPrice: data.maxPrice || 1000,
      totalSeats: (data.rowsCount || 20) * (data.seatsPerRow || 40),
      activeSeats: (data.rowsCount || 20) * (data.seatsPerRow || 40),
      rowsCount: data.rowsCount || 20,
      seatsPerRow: data.seatsPerRow || 40
    }]
  })
};

export default adminService;