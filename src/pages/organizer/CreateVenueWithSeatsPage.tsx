import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { venueAPI, CreateVenueWithSeatsRequest } from '../../services/venueAPI';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface SeatConfig {
  seatType: string;
  rowsCount: number;
  seatsPerRow: number;
  rowPrefix: string;
  basePrice: number;
  maxPrice: number;
}

const CreateVenueWithSeatsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueState: '',
    venueZipcode: '',
    venueType: '',
    venueContactInfo: ''
  });
  const [seatConfigs, setSeatConfigs] = useState<SeatConfig[]>([
    { seatType: 'Regular', rowsCount: 10, seatsPerRow: 10, rowPrefix: 'A', basePrice: 299, maxPrice: 598 },
    { seatType: 'Premium', rowsCount: 3, seatsPerRow: 8, rowPrefix: 'P', basePrice: 599, maxPrice: 1198 },
    { seatType: 'VIP', rowsCount: 2, seatsPerRow: 6, rowPrefix: 'V', basePrice: 999, maxPrice: 1998 }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) return;

    // Validate form data
    if (!formData.venueName.trim()) {
      toast.error('Venue name is required');
      return;
    }

    if (!formData.venueType) {
      toast.error('Venue type is required');
      return;
    }

    if (seatConfigs.length === 0) {
      toast.error('At least one seat configuration is required');
      return;
    }

    // Validate seat configurations
    for (const config of seatConfigs) {
      if (!config.seatType.trim()) {
        toast.error('Seat type is required for all configurations');
        return;
      }
      if (!config.rowPrefix.trim()) {
        toast.error('Row prefix is required for all configurations');
        return;
      }
      if (config.rowsCount <= 0 || config.seatsPerRow <= 0) {
        toast.error('Rows count and seats per row must be greater than 0');
        return;
      }
      if (config.basePrice <= 0 || config.maxPrice <= 0) {
        toast.error('Base price and max price must be greater than 0');
        return;
      }
      if (config.basePrice > config.maxPrice) {
        toast.error('Base price cannot be greater than max price');
        return;
      }
    }

    setSaving(true);
    try {
      const requestData = {
        VenueName: formData.venueName.trim(),
        VenueAddress: formData.venueAddress?.trim() || undefined,
        VenueCity: formData.venueCity?.trim() || undefined,
        VenueState: formData.venueState?.trim() || undefined,
        VenueZipcode: formData.venueZipcode?.trim() || undefined,
        VenueContactInfo: formData.venueContactInfo?.trim() || undefined,
        VenueType: formData.venueType,
        SeatConfigurations: seatConfigs.map(config => ({
          SeatType: config.seatType.trim(),
          RowsCount: Math.floor(config.rowsCount),
          SeatsPerRow: Math.floor(config.seatsPerRow),
          RowPrefix: config.rowPrefix.trim().toUpperCase(),
          BasePrice: parseFloat(config.basePrice.toString()),
          MaxPrice: parseFloat(config.maxPrice.toString())
        }))
      };

      await venueAPI.createVenueWithSeats(user.userId, requestData);
      
      toast.success('Venue created successfully with seat layout!');
      navigate('/organizer/venues');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create venue';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const updateSeatConfig = (index: number, field: keyof SeatConfig, value: any) => {
    const updated = [...seatConfigs];
    const numValue = field === 'rowsCount' || field === 'seatsPerRow' || field === 'basePrice' || field === 'maxPrice'
      ? (isNaN(parseFloat(value)) ? 0 : parseFloat(value))
      : value;
    updated[index] = { ...updated[index], [field]: numValue };
    setSeatConfigs(updated);
  };

  const addSeatConfig = () => {
    setSeatConfigs([...seatConfigs, {
      seatType: 'Custom',
      rowsCount: 5,
      seatsPerRow: 10,
      rowPrefix: 'C',
      basePrice: 500,
      maxPrice: 1000
    }]);
  };

  const removeSeatConfig = (index: number) => {
    setSeatConfigs(seatConfigs.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/organizer/venues')}
          className="flex items-center text-gray-300 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Venues
        </button>

        <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
          <h1 className="text-3xl font-bold text-white mb-8">Create Venue with Seat Layout</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Venue Details */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Venue Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Venue Name *</label>
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.venueAddress}
                    onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.venueCity}
                    onChange={(e) => setFormData({ ...formData, venueCity: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                  <input
                    type="text"
                    value={formData.venueState}
                    onChange={(e) => setFormData({ ...formData, venueState: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Zipcode</label>
                  <input
                    type="text"
                    value={formData.venueZipcode}
                    onChange={(e) => setFormData({ ...formData, venueZipcode: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Venue Type *</label>
                <select
                  value={formData.venueType}
                  onChange={(e) => setFormData({ ...formData, venueType: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
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

            {/* Seat Configurations */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Seat Configuration</h2>
                <button
                  type="button"
                  onClick={addSeatConfig}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Seat Type
                </button>
              </div>

              <div className="space-y-4">
                {seatConfigs.map((config, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg text-white">{config.seatType}</h3>
                      {seatConfigs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSeatConfig(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Seat Type</label>
                        <input
                          type="text"
                          value={config.seatType}
                          onChange={(e) => updateSeatConfig(index, 'seatType', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Row Prefix</label>
                        <input
                          type="text"
                          value={config.rowPrefix}
                          onChange={(e) => updateSeatConfig(index, 'rowPrefix', e.target.value)}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rows Count</label>
                        <input
                          type="number"
                          value={config.rowsCount}
                          onChange={(e) => updateSeatConfig(index, 'rowsCount', parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Seats Per Row</label>
                        <input
                          type="number"
                          value={config.seatsPerRow}
                          onChange={(e) => updateSeatConfig(index, 'seatsPerRow', parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Base Price (₹)</label>
                        <input
                          type="number"
                          value={config.basePrice}
                          onChange={(e) => updateSeatConfig(index, 'basePrice', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Max Price (₹)</label>
                        <input
                          type="number"
                          value={config.maxPrice}
                          onChange={(e) => updateSeatConfig(index, 'maxPrice', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                          min="0"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                      Total Seats: {config.rowsCount * config.seatsPerRow}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 font-medium"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Creating Venue...' : 'Create Venue with Seats'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/organizer/venues')}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 font-medium"
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

export default CreateVenueWithSeatsPage;
