import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { store } from './store'
import { useAuthPersistence } from './hooks/useAuthPersistence'
import './utils/apiTest'
import './styles/globals.css'

// Customer Pages
import { Events } from './pages/customer/Events'
import { EventDetails } from './pages/customer/EventDetails'
import { SeatSelection } from './pages/customer/SeatSelection'
import { Checkout } from './pages/customer/Checkout'
import { BookingConfirmation } from './pages/customer/BookingConfirmation'
import { MyBookings } from './pages/customer/MyBookings'
import HomePage from './pages/customer/HomePage'

// Auth Pages
import CustomerLogin from './pages/auth/CustomerLogin'
import CustomerRegister from './pages/auth/CustomerRegister'
import OrganizerLogin from './pages/auth/OrganizerLogin'
import OrganizerRegister from './pages/auth/OrganizerRegister'
import AdminLogin from './pages/auth/AdminLogin'

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import OrganizerEventsPage from './pages/organizer/OrganizerEventsPage'
import CreateEventPage from './pages/organizer/CreateEventPage'
import ViewEventPage from './pages/organizer/ViewEventPage'
import EditEventPage from './pages/organizer/EditEventPage'
import EventShowsPage from './pages/organizer/EventShowsPage'
import ShowManagementPage from './pages/organizer/ShowManagementPage'
import VenuesPage from './pages/organizer/VenuesPage'
import CreateVenuePage from './pages/organizer/CreateVenuePage'
import CreateVenueWithSeatsPage from './pages/organizer/CreateVenueWithSeatsPage'
import ViewVenuePage from './pages/organizer/ViewVenuePage'
import EditVenuePage from './pages/organizer/EditVenuePage'
import CreateAdvancedVenuePage from './pages/organizer/CreateAdvancedVenuePage'
import VenueSeatManagement from './pages/organizer/VenueSeatManagement'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ApprovalsPage from './pages/admin/ApprovalsPage'

// Shared
import ProfilePage from './pages/ProfilePage'

function AppContent() {
  useAuthPersistence()

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          {/* Customer */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/shows/:showId" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/booking/:bookingId" element={<BookingConfirmation />} />
          <Route path="/bookings" element={<MyBookings />} />

          {/* Auth */}
          <Route path="/login/customer" element={<CustomerLogin />} />
          <Route path="/register/customer" element={<CustomerRegister />} />
          <Route path="/login/organizer" element={<OrganizerLogin />} />
          <Route path="/register/organizer" element={<OrganizerRegister />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          {/* Organizer */}
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/events" element={<OrganizerEventsPage />} />
          <Route path="/organizer/events/create" element={<CreateEventPage />} />
          <Route path="/organizer/events/:eventId" element={<ViewEventPage />} />
          <Route path="/organizer/events/:eventId/edit" element={<EditEventPage />} />
          <Route path="/organizer/events/:eventId/shows" element={<EventShowsPage />} />
          <Route path="/organizer/shows/:showId" element={<ShowManagementPage />} />
          <Route path="/organizer/venues" element={<VenuesPage />} />
          <Route path="/organizer/venues/create" element={<CreateVenueWithSeatsPage />} />
          <Route path="/organizer/venues/create-simple" element={<CreateVenuePage />} />
          <Route path="/organizer/venues/:venueId" element={<ViewVenuePage />} />
          <Route path="/organizer/venues/:venueId/edit" element={<EditVenuePage />} />
          <Route path="/organizer/venues/create-advanced" element={<CreateAdvancedVenuePage />} />
          <Route path="/organizer/venues/:venueId/seats" element={<VenueSeatManagement />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<ApprovalsPage />} />

          {/* Shared */}
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
