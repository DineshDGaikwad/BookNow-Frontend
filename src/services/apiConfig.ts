// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5089/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// API Endpoints mapping to match backend controllers
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    CUSTOMER_LOGIN: '/auth/customer/login',
    CUSTOMER_REGISTER: '/auth/customer/register',
    ORGANIZER_LOGIN: '/auth/organizer/login',
    ORGANIZER_REGISTER: '/auth/organizer/register',
    ADMIN_LOGIN: '/auth/admin/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
  },
  
  // Customer Flow endpoints
  CUSTOMER: {
    EVENTS: '/customer/flow/events',
    EVENT_DETAILS: (id: string) => `/customer/flow/events/${id}`,
    SHOW_SEATS: (showId: string) => `/customer/flow/shows/${showId}/seats`,
    LOCK_SEATS: '/customer/flow/seats/lock',
    RELEASE_SEATS: '/customer/flow/seats/release',
    EXTEND_LOCK: '/customer/flow/seats/extend-lock',
    CREATE_BOOKING: '/customer/flow/booking/create',
    INITIATE_PAYMENT: '/customer/flow/payment/initiate',
    CONFIRM_PAYMENT: '/customer/flow/payment/confirm',
    COMPLETE_BOOKING: '/customer/flow/complete-booking',
    BOOKINGS: '/customer/bookings',
    BOOKING_DETAILS: (id: string) => `/customer/bookings/${id}`,
    CANCEL_BOOKING: (id: string) => `/customer/bookings/${id}/cancel`,
  },
  
  // Organizer endpoints
  ORGANIZER: {
    DASHBOARD: '/organizer/dashboard/summary',
    EVENTS: '/organizer/events',
    CREATE_EVENT: '/organizer/events',
    EVENT_DETAILS: (id: string) => `/organizer/events/${id}`,
    UPDATE_EVENT: (id: string) => `/organizer/events/${id}`,
    DELETE_EVENT: (id: string) => `/organizer/events/${id}`,
    VENUES: '/organizer/venues',
    CREATE_VENUE: '/organizer/venues',
    VENUE_DETAILS: (id: string) => `/organizer/venues/${id}`,
    SHOWS: '/organizer/shows',
    CREATE_SHOW: '/organizer/shows',
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD: '/admin/dashboard/stats',
    USERS: '/admin/users',
    EVENTS: '/admin/events',
    VENUES: '/admin/venues',
    APPROVALS: '/admin/approvals/pending',
  },
  
  // Health check
  HEALTH: '/health',
};

export default API_CONFIG;