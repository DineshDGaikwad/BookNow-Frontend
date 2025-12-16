import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import { setUser } from './store/authSlice';
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
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
      }
    }
  }, [dispatch]);

  return (
    <Router>
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
          <Route 
            path="/events" 
            element={
              <ProtectedRoute role="Customer">
                <div>Events Page - Coming Soon</div>
              </ProtectedRoute>
            } 
          />
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
                <div>Organizer Dashboard - Coming Soon</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizer/events" 
            element={
              <ProtectedRoute role="Organizer">
                <div>Manage Events - Coming Soon</div>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="Admin">
                <div>Admin Dashboard - Coming Soon</div>
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