import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { venueAPI, VenueResponse } from '../../services/venueAPI';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const EditVenuePage: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueState: '',
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
      const data = await venueAPI.getVenue(venueId, user.userId);
      setFormData({
        venueName: data.venueName,
        venueAddress: data.venueAddress || '',
        venueCity: data.venueCity || '',
        venueState: data.venueState || '',
        venueCapacity: data.venueCapacity,
        venueType: data.venueType || ''
      });
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/organizer/venues/${venueId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Venue
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Venue</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue Name *
              </label>
              <input
                type="text"
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                value={formData.venueAddress}
                onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.venueCity}
                  onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.venueState}
                  onChange={(e) => setFormData({ ...formData, venueState: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  value={formData.venueCapacity}
                  onChange={(e) => setFormData({ ...formData, venueCapacity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.venueType}
                  onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving Details...' : 'Save Details'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/organizer/venues/${venueId}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
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
