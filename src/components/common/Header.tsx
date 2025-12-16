import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';

const Header: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'Customer': return '/';
      case 'Organizer': return '/organizer';
      case 'Admin': return '/admin';
      default: return '/';
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BookNow</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                {user?.role === 'Customer' && (
                  <>
                    <Link to="/events" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Events
                    </Link>
                    <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                      My Bookings
                    </Link>
                  </>
                )}
                {user?.role === 'Organizer' && (
                  <>
                    <Link to="/organizer/events" className="text-gray-700 hover:text-blue-600 transition-colors">
                      My Events
                    </Link>
                    <Link to="/organizer/venues" className="text-gray-700 hover:text-blue-600 transition-colors">
                      Venues
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/events" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Events
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;