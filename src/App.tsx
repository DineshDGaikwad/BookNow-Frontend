import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import { setUser, setToken, initializeAuth } from './store/authSlice';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CustomerLogin from './pages/auth/CustomerLogin';
import OrganizerLogin from './pages/auth/OrganizerLogin';
import AdminLogin from './pages/auth/AdminLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import OrganizerRegister from './pages/auth/OrganizerRegister';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import CustomerEventsPage from './pages/customer/CustomerEventsPage';
import EventDetailsPage from './pages/customer/EventDetailsPage';
import SeatSelection from './pages/customer/SeatSelection';
import Checkout from './pages/customer/Checkout';
import BookingConfirmation from './pages/customer/BookingConfirmation';
import ProfilePage from './pages/ProfilePage';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerEventsPage from './pages/organizer/OrganizerEventsPage';
import CreateEventPage from './pages/organizer/CreateEventPage';
import VenuesPage from './pages/organizer/VenuesPage';
import CreateVenuePage from './pages/organizer/CreateVenuePage';
import FastShowManagement from './pages/organizer/FastShowManagement';
import TestAPI from './pages/organizer/TestAPI';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing auth token on app load
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch(setUser(user));
        dispatch(setToken(token));
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/customer" element={<CustomerLogin />} />
          <Route path="/login/organizer" element={<OrganizerLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/customer" element={<CustomerRegister />} />
          <Route path="/register/organizer" element={<OrganizerRegister />} />
          
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<CustomerEventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/shows/:showId/seats" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/booking/:bookingId" element={<BookingConfirmation />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute role="Customer">
                <div>My Bookings - Coming Soon</div>
              </ProtectedRoute>
            } 
          />
          
          {/* Organizer Routes */}
          <Route 
            path="/organizer" 
            element={
              <ProtectedRoute role="Organizer">
                <OrganizerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/events" 
            element={
              <ProtectedRoute role="Organizer">
                <OrganizerEventsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/events/create" 
            element={
              <ProtectedRoute role="Organizer">
                <CreateEventPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/venues" 
            element={
              <ProtectedRoute role="Organizer">
                <VenuesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/venues/create" 
            element={
              <ProtectedRoute role="Organizer">
                <CreateVenuePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/events/:eventId" 
            element={
              <ProtectedRoute role="Organizer">
                <div>Event Details - Coming Soon</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/events/:eventId/edit" 
            element={
              <ProtectedRoute role="Organizer">
                <div>Edit Event - Coming Soon</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/events/:eventId/shows" 
            element={
              <ProtectedRoute role="Organizer">
                <FastShowManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test-api" 
            element={<TestAPI />} 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/approvals" 
            element={
              <ProtectedRoute role="Admin">
                <div>Pending Approvals - Coming Soon</div>
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Routes */}
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;