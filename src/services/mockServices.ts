import { realOrganizerAPI } from './realOrganizerAPI';

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

export const bookingService = {
  createBooking: async (data: any) => ({ data: null }),
  getUserBookings: async (userId: string) => [],
  getBookingDetails: async (id: string) => null,
  cancelBooking: async (id: string) => ({ data: null })
};

export const customerAPI = {
  getEvents: async (filters?: any) => [],
  getFeaturedEvents: async (limit?: number) => [],
  getEventById: async (id: string, includeReviews?: boolean) => null,
  getEventDetails: async (id: string, includeReviews?: boolean) => null,
  getEventReviews: async (id: string) => [],
  getShowDetails: async (id: string, includeSeats?: boolean) => null,
  getShowSeats: async (id: string, page?: number, pageSize?: number) => ({ seats: [], currentPage: page || 1, totalPages: 1 }),
  selectSeat: async (seatId: string, userId: string) => null,
  deselectSeat: async (seatId: string, userId: string) => null,
  getRealTimeSeatStatus: async (showId: string) => [],
  releaseUserSelection: async (userId: string, showId: string) => {},
  validateSeats: async (userId: string, seatIds: string[]) => ({ isValid: true, message: '' })
};

export const organizerAPI = {
  getDashboard: realOrganizerAPI.getDashboard,
  getEvents: realOrganizerAPI.getEvents,
  getAllEvents: realOrganizerAPI.getAllEvents,
  createEvent: realOrganizerAPI.createEvent,
  getEvent: realOrganizerAPI.getEvent,
  updateEvent: realOrganizerAPI.updateEvent,
  deleteEvent: realOrganizerAPI.deleteEvent,
  getVenues: realOrganizerAPI.getVenues
};

export const profileService = {
  updateProfile: async (userId: string, data: any) => ({ data: null }),
  getProfile: async (userId: string) => ({ data: null })
};

export const seatConfigAPI = {
  getVenueSeatConfigurations: async (venueId: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5089/api'}/organizer/shows/venue/${venueId}/seat-constraints`);
    const data = await response.json();
    return data.seatTypes || data;
  }
};

export const showAPI = {
  createShow: realOrganizerAPI.createShow,
  createShowWithSeatPricing: realOrganizerAPI.createShowWithSeatPricing,
  getEventShows: (eventId: string, organizerId: string) => realOrganizerAPI.getShows(organizerId, eventId),
  getShow: realOrganizerAPI.getShow,
  updateShow: realOrganizerAPI.updateShow,
  deleteShow: realOrganizerAPI.deleteShow,
  
  updatePricing: async (showId: string, organizerId: string, data: any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5089/api'}/organizer/shows/${showId}/pricing?organizerId=${organizerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  generateSeats: async (showId: string, organizerId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5089/api'}/organizer/shows/${showId}/generate-seats?organizerId=${organizerId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

export const venueAPI = {
  createVenue: realOrganizerAPI.createVenue,
  createVenueWithSeats: realOrganizerAPI.createVenueWithSeats,
  getVenues: realOrganizerAPI.getVenues,
  getVenue: realOrganizerAPI.getVenue,
  updateVenue: realOrganizerAPI.updateVenue,
  deleteVenue: realOrganizerAPI.deleteVenue,
  getVenueSeats: realOrganizerAPI.getVenueSeats,
  getVenueSeatConfigurations: realOrganizerAPI.getVenueSeatConfigurations,
  
  getApprovedVenues: async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5089/api'}/venues`);
    return response.json();
  },
  
  getPublicVenue: async (venueId: string) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5089/api'}/venues/${venueId}`);
    return response.json();
  },
  
  updateSeatPricing: async (venueId: string, organizerId: string, data: any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5089/api'}/organizer/venues/${venueId}/seat-pricing?organizerId=${organizerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  updateSeatStatus: async (venueId: string, organizerId: string, data: any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5089/api'}/organizer/venues/${venueId}/seat-status?organizerId=${organizerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  toggleVenueStatus: async (venueId: string, organizerId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5089/api'}/organizer/venues/${venueId}/toggle-status?organizerId=${organizerId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },
  
  updateSeatLayout: async (venueId: string, organizerId: string, data: any) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5089/api'}/organizer/venues/${venueId}/seat-configurations?organizerId=${organizerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  getVenueFormData: (venueId: string, organizerId: string) => realOrganizerAPI.getVenueFormData(venueId, organizerId),
};

export default adminService;