import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { organizerAPI, EventResponse } from '../../services/organizerAPI';
import { ArrowLeft, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const ViewEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId && eventId) {
      loadEvent();
    }
  }, [user, eventId]);

  const loadEvent = async () => {
    try {
      if (!user?.userId || !eventId) return;
      const data = await organizerAPI.getEvent(eventId, user.userId);
      setEvent(data);
    } catch (error) {
      console.error('Failed to load event:', error);
      toast.error('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      if (!user?.userId || !eventId) return;
      await organizerAPI.deleteEvent(eventId, user.userId);
      toast.success('Event deleted successfully');
      navigate('/organizer/events');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  const getStatusColor = (status: string | number) => {
    const statusStr = typeof status === 'number' ? getStatusText(status) : status;
    switch (statusStr.toLowerCase()) {
      case 'published': case 'live': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link to="/organizer/events" className="text-blue-500 hover:text-blue-600">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/organizer/events')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {event.posterUrl && (
            <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500">
              <img src={event.posterUrl} alt={event.eventTitle} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.eventTitle}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.eventStatus)}`}>
                  {getStatusText(event.eventStatus)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/organizer/events/${eventId}/edit`)}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-900">{event.eventDescription || 'No description available'}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                  <p className="text-gray-900">{event.eventCategory}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Genre</h3>
                  <p className="text-gray-900">{event.eventGenre || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Shows</h3>
                  <p className="text-gray-900">{event.showCount}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
                  <p className="text-gray-900">{new Date(event.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Link
                  to={`/organizer/events/${eventId}/shows`}
                  className="flex items-center justify-center w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Manage Shows ({event.showCount})
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEventPage;
