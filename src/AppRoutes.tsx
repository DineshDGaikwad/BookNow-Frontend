import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import OrganizerLogin from './pages/auth/OrganizerLogin';
import OrganizerRegister from './pages/auth/OrganizerRegister';
import AdminLogin from './pages/auth/AdminLogin';

// Customer pages
import HomePage from './pages/customer/HomePage';
import { Events } from './pages/customer/Events';
import { EventDetails } from './pages/customer/EventDetails';
import { SeatSelection } from './pages/customer/SeatSelection';
import { Checkout } from './pages/customer/Checkout';
import { MyBookings } from './pages/customer/MyBookings';
import { BookingConfirmation } from './pages/customer/BookingConfirmation';

// Organizer pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerEventsPage from './pages/organizer/OrganizerEventsPage';
import CreateEventPage from './pages/organizer/CreateEventPage';
import CreateVenuePage from './pages/organizer/CreateVenuePage';
import VenuesPage from './pages/organizer/VenuesPage';
import ViewEventPage from './pages/organizer/ViewEventPage';
import EditEventPage from './pages/organizer/EditEventPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Common pages
import ProfilePage from './pages/ProfilePage';

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login/customer" element={<CustomerLogin />} />
        <Route path="/register/customer" element={<CustomerRegister />} />
        <Route path="/login/organizer" element={<OrganizerLogin />} />
        <Route path="/register/organizer" element={<OrganizerRegister />} />
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* Customer Routes */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/seat-selection/:showId" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <SeatSelection />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/booking/:bookingId" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <BookingConfirmation />
          </ProtectedRoute>
        } />

        {/* Organizer Protected Routes */}
        <Route path="/organizer" element={
          <ProtectedRoute allowedRoles={['Organizer']}>
            <Navigate to="/organizer/dashboard" replace />
          </ProtectedRoute>
        } />
        <Route path="/organizer/dashboard" element={
          <ProtectedRoute allowedRoles={['Organizer']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/organizer/events" element={
          <ProtectedRoute allowedRoles={['Organizer']}>
            <OrganizerEventsPage />
          </ProtectedRoute>
        } />
        <Route path="/organizer/create-event" element={
          <ProtectedRoute allowedRoles={['Organizer']}>
            <CreateEventPage />
          </ProtectedRoute>
        } />
        <Route path="/organizer/venues" element={
          <ProtectedRoute allowedRoles={['Organizer']}>
            <VenuesPage />
          </ProtectedRoute>
        } />
        <Route path="/organizer/create-venue" element={
          <ProtectedRoute allowedRoles={['Organizer']}>
            <CreateVenuePage />
          </ProtectedRoute>
        } />
        <Route path="/organizer/events/:id" element={
          <ProtectedRoute allowedRoles={['Organizer']}>
            <ViewEventPage />
          </ProtectedRoute>
        } />
        <Route path="/organizer/events/:id/edit" element={
          <ProtectedRoute allowedRoles={['Organizer']}>
            <EditEventPage />
          </ProtectedRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Profile Route */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['Customer', 'Organizer', 'Admin']}>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Dashboard redirect */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            user?.role === 'Customer' ? <Navigate to="/" replace /> :
            user?.role === 'Organizer' ? <Navigate to="/organizer/dashboard" replace /> :
            user?.role === 'Admin' ? <Navigate to="/admin/dashboard" replace /> :
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};