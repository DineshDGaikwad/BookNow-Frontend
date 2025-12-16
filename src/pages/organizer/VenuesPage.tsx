import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { venueAPI, VenueResponse } from '../../services/venueAPI';

const VenuesPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadVenues();
    }
  }, [user]);

  const loadVenues = async () => {
    try {
      if (!user?.userId) return;
      const data = await venueAPI.getVenues(user.userId);
      setVenues(data);
    } catch (error: any) {
      console.error('Failed to load venues:', error);
      if (error.response?.status === 401) {
        window.location.href = '/login/organizer';
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800'; // Approved
      case 0: return 'bg-yellow-100 text-yellow-800'; // Pending
      case 2: return 'bg-red-100 text-red-800'; // Rejected
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Venues</h1>
            <p className="text-gray-600">Manage your venue listings</p>
          </div>
          <Link
            to="/organizer/venues/create"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Add New Venue
          </Link>
        </div>

        {venues.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-lg text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Venues Yet</h2>
            <p className="text-gray-600 mb-8">Add your first venue to start hosting events!</p>
            <Link
              to="/organizer/venues/create"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Add Your First Venue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div key={venue.venueId} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <div className="text-white text-6xl">🏢</div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{venue.venueName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(venue.venueStatus)}`}>
                      {getStatusText(venue.venueStatus)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{venue.venueAddress}</p>
                  <p className="text-gray-600 text-sm mb-3">{venue.venueCity}, {venue.venueState}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Capacity: {venue.venueCapacity}</span>
                    <span>{new Date(venue.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/organizer/venues/${venue.venueId}`}
                      className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      to={`/organizer/venues/${venue.venueId}/edit`}
                      className="flex-1 bg-gray-500 text-white text-center py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesPage;