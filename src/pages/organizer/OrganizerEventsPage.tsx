import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Eye, Edit, Calendar, Users, Tag, Clock } from 'lucide-react';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { organizerAPI, EventResponse } from '../../services/organizerAPI';

const OrganizerEventsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'live' | 'draft' | 'cancelled'>('all');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'my-events' | 'all-events'>('my-events');

  useEffect(() => {
    if (user?.userId) {
      loadEvents();
    }
  }, [user, viewMode]);

  const loadEvents = async () => {
    try {
      if (!user?.userId) return;
      let data;
      if (viewMode === 'my-events') {
        data = await organizerAPI.getEvents(user.userId);
      } else {
        data = await organizerAPI.getAllEvents();
      }
      setEvents(data);
    } catch (error: any) {
      console.error('Failed to load events:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login/organizer';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(eventId);
    try {
      await organizerAPI.deleteEvent(eventId, user!.userId);
      setEvents(events.filter(e => e.eventId !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusText = (status: string | number) => {
    if (typeof status === 'string') return status;
    switch (status) {
      case 0: return 'Draft';
      case 1: return 'Live';
      case 2: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    const statusText = getStatusText(event.eventStatus).toLowerCase();
    return statusText === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
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
            <h1 className="text-3xl font-bold text-white">Event Management</h1>
            <p className="text-gray-400 mt-2">
              {viewMode === 'my-events' ? 'Create and manage your event portfolio' : 'Browse all events on the platform'}
            </p>
          </div>
          {viewMode === 'my-events' && (
            <Button asChild className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
              <Link to="/organizer/events/create">
                <Plus className="h-4 w-4" />
                Create New Event
              </Link>
            </Button>
          )}
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <Button
            variant="ghost"
            onClick={() => setViewMode('my-events')}
            className={`px-6 py-3 rounded-none border-b-2 transition-colors ${
              viewMode === 'my-events'
                ? 'border-purple-500 text-purple-400 bg-purple-900/20'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            My Events
          </Button>
          <Button
            variant="ghost"
            onClick={() => setViewMode('all-events')}
            className={`px-6 py-3 rounded-none border-b-2 transition-colors ${
              viewMode === 'all-events'
                ? 'border-purple-500 text-purple-400 bg-purple-900/20'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            All Events
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-900/50 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Events</p>
                  <p className="text-2xl font-bold text-white">{events.length}</p>
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
                  <p className="text-sm text-gray-400">Live Events</p>
                  <p className="text-2xl font-bold text-white">
                    {events.filter(e => getStatusText(e.eventStatus).toLowerCase() === 'live').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-900/50 rounded-lg">
                  <Edit className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Draft Events</p>
                  <p className="text-2xl font-bold text-white">
                    {events.filter(e => getStatusText(e.eventStatus).toLowerCase() === 'draft').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-900/50 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Shows</p>
                  <p className="text-2xl font-bold text-white">
                    {events.reduce((sum, e) => sum + (e.showCount || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
            className={filter === 'all' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            All ({events.length})
          </Button>
          <Button
            variant={filter === 'live' ? 'default' : 'outline'}
            onClick={() => setFilter('live')}
            size="sm"
            className={filter === 'live' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            Live ({events.filter(e => getStatusText(e.eventStatus).toLowerCase() === 'live').length})
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
            size="sm"
            className={filter === 'draft' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            Draft ({events.filter(e => getStatusText(e.eventStatus).toLowerCase() === 'draft').length})
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'default' : 'outline'}
            onClick={() => setFilter('cancelled')}
            size="sm"
            className={filter === 'cancelled' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
          >
            Cancelled ({events.filter(e => getStatusText(e.eventStatus).toLowerCase() === 'cancelled').length})
          </Button>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {viewMode === 'my-events' 
                ? (filter === 'all' ? 'No Events Yet' : `No ${filter} events`) 
                : (filter === 'all' ? 'No Events Available' : `No ${filter} events available`)}
            </h3>
            <p className="text-gray-400 mb-4">
              {viewMode === 'my-events'
                ? (filter === 'all' 
                    ? 'Start creating amazing events for your audience!' 
                    : `You don't have any ${filter} events at the moment.`)
                : (filter === 'all'
                    ? 'No events are currently available on the platform.'
                    : `No ${filter} events are currently available.`)}
            </p>
            {filter === 'all' && viewMode === 'my-events' && (
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                <Link to="/organizer/events/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Event
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.eventId} className="bg-gray-800 border-gray-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all">
                <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center rounded-t-2xl">
                  {event.posterUrl ? (
                    <img src={event.posterUrl} alt={event.eventTitle} className="w-full h-full object-cover rounded-t-2xl" />
                  ) : (
                    <Calendar className="h-16 w-16 text-white" />
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate text-white">{event.eventTitle}</CardTitle>
                    <Badge variant={
                      getStatusText(event.eventStatus).toLowerCase() === 'live' ? 'default' :
                      getStatusText(event.eventStatus).toLowerCase() === 'draft' ? 'secondary' : 'destructive'
                    } className={
                      getStatusText(event.eventStatus).toLowerCase() === 'live' ? 'bg-green-600 text-white' :
                      getStatusText(event.eventStatus).toLowerCase() === 'draft' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                    }>
                      {getStatusText(event.eventStatus)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p className="flex items-center gap-1 mb-1">
                      <Tag className="h-3 w-3" />
                      {event.eventCategory}
                    </p>
                    <p className="line-clamp-2">{event.eventDescription || 'No description available'}</p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{event.showCount || 0} shows</span>
                      <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700" asChild>
                        <Link to={`/organizer/events/${event.eventId}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      {viewMode === 'my-events' && event.organizerId === user?.userId && (
                        <>
                          <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700" asChild>
                            <Link to={`/organizer/events/${event.eventId}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDeleteEvent(event.eventId, event.eventTitle)}
                            disabled={deleting === event.eventId}
                          >
                            {deleting === event.eventId ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {viewMode === 'my-events' && event.organizerId === user?.userId && (
                      <Button size="sm" variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700" asChild>
                        <Link to={`/organizer/events/${event.eventId}/shows`}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Manage Shows ({event.showCount || 0})
                        </Link>
                      </Button>
                    )}
                    {viewMode === 'all-events' && (
                      <div className="text-xs text-gray-500 mt-2">
                        Organizer: {event.organizerName || event.organizerId}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerEventsPage;