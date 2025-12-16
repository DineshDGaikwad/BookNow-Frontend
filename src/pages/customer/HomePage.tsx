import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import HeroSection from '../../components/customer/HeroSection';

const HomePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      
      {user ? (
        // Authenticated user dashboard
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-600">Ready to discover your next amazing event?</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-2xl mb-3">🎭</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Events</h3>
              <p className="text-gray-600 mb-4">Discover exciting events happening near you</p>
              <Link to="/events" className="text-blue-500 hover:text-blue-600 font-medium">
                Explore Now →
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-2xl mb-3">🎫</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Bookings</h3>
              <p className="text-gray-600 mb-4">View and manage your upcoming events</p>
              <button className="text-blue-500 hover:text-blue-600 font-medium">
                View Bookings →
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-2xl mb-3">⭐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reviews</h3>
              <p className="text-gray-600 mb-4">Share your experience with others</p>
              <button className="text-blue-500 hover:text-blue-600 font-medium">
                Write Review →
              </button>
            </div>
          </div>

          {/* Featured Events Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Event cards will be loaded here */}
              <div className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
              <div className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
              <div className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Public landing page
        <HeroSection />
      )}
    </div>
  );
};

export default HomePage;