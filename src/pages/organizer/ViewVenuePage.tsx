import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { venueAPI, VenueResponse } from '../../services/venueAPI';
import { ArrowLeft, Edit, MapPin, Users } from 'lucide-react';
import { toast } from 'react-toastify';

const ViewVenuePage: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [venue, setVenue] = useState<VenueResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId && venueId) {
      loadVenue();
    }
  }, [user, venueId]);

  const loadVenue = async () => {
    try {
      if (!venueId) return;
      
      // Try organizer endpoint first, fallback to public endpoint
      try {
        if (user?.userId) {
          const data = await venueAPI.getVenue(venueId, user.userId);
          setVenue(data);
          return;
        }
      } catch (err) {
        // If organizer endpoint fails, try public endpoint
      }
      
      // Fallback to public endpoint
      const data = await venueAPI.getPublicVenue(venueId);
      setVenue(data);
    } catch (error) {
      toast.error('Failed to load venue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800';
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Approved';
      case 0: return 'Pending';
      case 2: return 'Rejected';
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

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue not found</h2>
          <Link to="/organizer/venues" className="text-blue-500 hover:text-blue-600">
            Back to Venues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/organizer/venues')}
          className="flex items-center text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Venues
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
            <div className="text-white text-8xl">🏢</div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{venue.venueName}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(venue.venueStatus)}`}>
                  {getStatusText(venue.venueStatus)}
                </span>
              </div>
              {venue.organizerId === user?.userId && (
                <Link
                  to={`/organizer/venues/${venueId}/edit`}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address
                </h3>
                <p className="text-white">{venue.venueAddress}</p>
                <p className="text-white">{venue.venueCity}, {venue.venueState}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Capacity
                  </h3>
                  <p className="text-white text-2xl font-bold">{venue.venueCapacity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Type</h3>
                  <p className="text-white">{venue.venueType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Created</h3>
                  <p className="text-white">{new Date(venue.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {venue.organizerId === user?.userId && (
                <div className="pt-6 border-t">
                  <Link
                    to={`/organizer/venues/${venueId}/seats`}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
                  >
                    Manage Seat Layout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVenuePage;
