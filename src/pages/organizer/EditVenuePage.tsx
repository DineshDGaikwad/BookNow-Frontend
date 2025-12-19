import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { venueAPI, VenueResponse } from '../../services/venueAPI';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface SeatConfig {
  seatType: string;
  rowPrefix: string;
  rowsCount: number;
  seatsPerRow: number;
  basePrice: number;
  maxPrice: number;
  totalSeats: number;
}

const EditVenuePage: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasSeats, setHasSeats] = useState(false);
  const [seatConfigurations, setSeatConfigurations] = useState<SeatConfig[]>([]);
  const [formData, setFormData] = useState({
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueState: '',
    venueZipcode: '',
    venueContactInfo: '',
    venueCapacity: 0,
    venueType: ''
  });

  useEffect(() => {
    if (user?.userId && venueId) {
      loadVenue();
    }
  }, [user, venueId]);

  const loadVenue = async () => {
    try {
      if (!user?.userId || !venueId) return;
      const data = await venueAPI.getVenueFormData(venueId, user.userId);
      if (data) {
        setFormData({
          venueName: data.venueName || '',
          venueAddress: data.venueAddress || '',
          venueCity: data.venueCity || '',
          venueState: data.venueState || '',
          venueZipcode: data.venueZipcode || '',
          venueContactInfo: data.venueContactInfo || '',
          venueCapacity: data.venueCapacity || 0,
          venueType: data.venueType || ''
        });
        setHasSeats(data.hasSeats || false);
        setSeatConfigurations(data.seatConfigurations || []);
      }
    } catch (error) {
      console.error('Failed to load venue:', error);
      toast.error('Failed to load venue');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId || !venueId) return;

    setSaving(true);
    try {
      await venueAPI.updateVenue(venueId, user.userId, formData);
      toast.success('Venue details saved successfully');
      navigate(`/organizer/venues/${venueId}`);
    } catch (error) {
      console.error('Failed to update venue:', error);
      toast.error('Failed to save venue details');
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/organizer/venues/${venueId}`)}
          className="flex items-center text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Venue
        </button>

        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Edit Venue</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.venueCity}
                  onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.venueState}
                  onChange={(e) => setFormData({ ...formData, venueState: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacity {hasSeats ? '(Auto-calculated from seats)' : '*'}
                </label>
                <input
                  type="number"
                  value={formData.venueCapacity}
                  onChange={(e) => setFormData({ ...formData, venueCapacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  min="1"
                  disabled={hasSeats}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type *
                </label>
                <select
                  value={formData.venueType}
                  onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Theater">Theater</option>
                  <option value="Stadium">Stadium</option>
                  <option value="Arena">Arena</option>
                  <option value="Hall">Hall</option>
                  <option value="Auditorium">Auditorium</option>
                  <option value="Convention Center">Convention Center</option>
                </select>
              </div>
            </div>

            {/* Seat Configurations Display */}
            {hasSeats && seatConfigurations.length > 0 && (
              <div className="border-t border-gray-700 pt-6">
                <h2 className="text-xl font-bold text-white mb-4">Seat Configurations</h2>
                <div className="space-y-4">
                  {seatConfigurations.map((config, index) => (
                    <div key={index} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Seat Type</p>
                          <p className="text-white font-medium">{config.seatType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Row Prefix</p>
                          <p className="text-white font-medium">{config.rowPrefix}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Rows × Seats</p>
                          <p className="text-white font-medium">{config.rowsCount} × {config.seatsPerRow}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Seats</p>
                          <p className="text-white font-medium">{config.totalSeats}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Base Price</p>
                          <p className="text-white font-medium">${config.basePrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Max Price</p>
                          <p className="text-white font-medium">${config.maxPrice}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Note: Seat configurations cannot be edited here. Use the "Manage Seat Layout" option from the venue details page.
                </p>
              </div>
            )}

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 font-medium"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving Details...' : 'Save Details'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/organizer/venues/${venueId}`)}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVenuePage;
