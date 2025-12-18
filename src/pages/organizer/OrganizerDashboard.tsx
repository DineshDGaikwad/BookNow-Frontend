import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Building2, BarChart3, TrendingUp, Users, MapPin, Clock } from 'lucide-react';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
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
        window.location.href = '/login/organizer';
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name}! 🎪
            </h1>
            <p className="text-gray-400 mt-2">Manage your events and track your success</p>
          </div>
          <Button asChild className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
            <Link to="/organizer/events/create">
              <Plus className="h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-900/50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Events</p>
                  <p className="text-2xl font-bold text-white">{dashboard?.totalEvents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-900/50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Shows</p>
                  <p className="text-2xl font-bold text-white">{dashboard?.totalShows || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-900/50 rounded-lg">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tickets Sold</p>
                  <p className="text-2xl font-bold text-white">{dashboard?.totalTicketsSold || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-900/50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">₹{dashboard?.totalRevenue || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 border-0 hover:shadow-xl hover:shadow-purple-500/20 transition-all cursor-pointer">
            <Link to="/organizer/events/create">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Create New Event</h3>
                    <p className="text-purple-100">Start planning your next amazing event</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:shadow-xl hover:shadow-green-500/10 transition-all cursor-pointer">
            <Link to="/organizer/events">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-900/50 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Manage Events</h3>
                    <p className="text-gray-400">View and edit your existing events</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:shadow-xl hover:shadow-orange-500/10 transition-all cursor-pointer">
            <Link to="/organizer/venues">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-900/50 rounded-lg">
                    <Building2 className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Venues</h3>
                    <p className="text-gray-400">Manage your venue listings</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Events */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5" />
              Recent Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.recentEvents?.length ? (
              <div className="space-y-4">
                {dashboard.recentEvents.map((event) => (
                  <div key={event.eventId} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-white">{event.eventTitle}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge variant={event.eventStatus === 'Active' ? 'default' : 'secondary'} 
                               className={event.eventStatus === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}>
                          {event.eventStatus}
                        </Badge>
                        <span className="text-sm text-gray-400">{event.showCount} shows</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">₹{event.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Events Yet</h3>
                <p className="text-gray-400 mb-4">Create your first event to get started!</p>
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link to="/organizer/events/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Shows */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5" />
              Upcoming Shows
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.upcomingShows?.length ? (
              <div className="space-y-4">
                {dashboard.upcomingShows.map((show) => (
                  <div key={show.showId} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-white">{show.eventTitle}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {show.venueName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(show.showStartTime).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{show.ticketsSold} tickets sold</p>
                      <p className="font-semibold text-green-400">₹{show.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Upcoming Shows</h3>
                <p className="text-gray-400">Schedule shows for your events to see them here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;