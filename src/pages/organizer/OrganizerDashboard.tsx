import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { organizerAPI, OrganizerDashboard } from '../../services/organizerAPI';

const OrganizerDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [dashboard, setDashboard] = useState<OrganizerDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      if (!user?.userId) return;
      const data = await organizerAPI.getDashboard(user.userId);
      setDashboard(data);
    } catch (error: any) {
      console.error('Failed to load dashboard:', error);
      if (error.response?.status === 401) {
        // Token expired, redirect to login
        window.location.href = '/login/organizer';
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 🎪
          </h1>
          <p className="text-gray-600">Manage your events and track your success</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-blue-600">{dashboard?.totalEvents || 0}</p>
              </div>
              <div className="text-3xl">🎭</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Shows</p>
                <p className="text-2xl font-bold text-purple-600">{dashboard?.totalShows || 0}</p>
              </div>
              <div className="text-3xl">🎪</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tickets Sold</p>
                <p className="text-2xl font-bold text-green-600">{dashboard?.totalTicketsSold || 0}</p>
              </div>
              <div className="text-3xl">🎫</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-yellow-600">₹{dashboard?.totalRevenue || 0}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/organizer/events/create" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
            <div className="text-2xl mb-3">➕</div>
            <h3 className="text-lg font-semibold mb-2">Create New Event</h3>
            <p className="text-blue-100">Start planning your next amazing event</p>
          </Link>

          <Link to="/organizer/events" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-2xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Events</h3>
            <p className="text-gray-600">View and edit your existing events</p>
          </Link>

          <Link to="/organizer/venues" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-2xl mb-3">🏢</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Venues</h3>
            <p className="text-gray-600">Manage your venue listings</p>
          </Link>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Events</h2>
          {dashboard?.recentEvents?.length ? (
            <div className="space-y-4">
              {dashboard.recentEvents.map((event) => (
                <div key={event.eventId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.eventTitle}</h3>
                    <p className="text-sm text-gray-600">Status: {event.eventStatus}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{event.showCount} shows</p>
                    <p className="font-semibold text-green-600">₹{event.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No events yet. Create your first event!</p>
          )}
        </div>

        {/* Upcoming Shows */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Shows</h2>
          {dashboard?.upcomingShows?.length ? (
            <div className="space-y-4">
              {dashboard.upcomingShows.map((show) => (
                <div key={show.showId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{show.eventTitle}</h3>
                    <p className="text-sm text-gray-600">{show.venueName}</p>
                    <p className="text-sm text-gray-500">{new Date(show.showStartTime).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{show.ticketsSold} tickets sold</p>
                    <p className="font-semibold text-green-600">₹{show.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No upcoming shows scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;