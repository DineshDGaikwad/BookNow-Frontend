import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import only existing pages with default exports
import HomePage from './pages/customer/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CustomerLogin from './pages/auth/CustomerLogin';
import CustomerRegister from './pages/auth/CustomerRegister';
import OrganizerLogin from './pages/auth/OrganizerLogin';
import OrganizerRegister from './pages/auth/OrganizerRegister';
import AdminLogin from './pages/auth/AdminLogin';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerEventsPage from './pages/organizer/OrganizerEventsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
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