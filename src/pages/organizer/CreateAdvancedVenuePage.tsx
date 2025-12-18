import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, MapPin, Building, Users, DollarSign } from 'lucide-react';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'react-toastify';

interface SeatConfiguration {
  seatType: string;
  rowsCount: number;
  seatsPerRow: number;
  rowPrefix: string;
  basePrice: number;
  maxPrice: number;
}

const CreateAdvancedVenuePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [venueData, setVenueData] = useState({
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueState: '',
    venueZipcode: '',
    venueContactInfo: ''
  });

  const [seatConfigurations, setSeatConfigurations] = useState<SeatConfiguration[]>([
    {
      seatType: 'Regular',
      rowsCount: 10,
      seatsPerRow: 10,
      rowPrefix: 'A',
      basePrice: 299,
      maxPrice: 499
    }
  ]);

  const seatTypes = ['Regular', 'Premium', 'VIP'];
  const rowPrefixes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'P', 'V'];

  const addSeatConfiguration = () => {
    setSeatConfigurations([...seatConfigurations, {
      seatType: 'Premium',
      rowsCount: 3,
      seatsPerRow: 8,
      rowPrefix: 'P',
      basePrice: 599,
      maxPrice: 999
    }]);
  };

  const removeSeatConfiguration = (index: number) => {
    setSeatConfigurations(seatConfigurations.filter((_, i) => i !== index));
  };

  const updateSeatConfiguration = (index: number, field: keyof SeatConfiguration, value: any) => {
    const updated = [...seatConfigurations];
    updated[index] = { ...updated[index], [field]: value };
    setSeatConfigurations(updated);
  };

  const getTotalCapacity = () => {
    return seatConfigurations.reduce((total, config) => 
      total + (config.rowsCount * config.seatsPerRow), 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (seatConfigurations.length === 0) {
      toast.error('Please add at least one seat configuration');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call
      const payload = {
        ...venueData,
        seatConfigurations
      };
      
      console.log('Creating venue with payload:', payload);
      toast.success('Venue created successfully!');
      navigate('/organizer/venues');
    } catch (error) {
      toast.error('Failed to create venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Advanced Venue</h1>
          <p className="text-gray-600">Set up your venue with custom seat configurations and pricing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Venue Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Venue Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name *</label>
                  <Input
                    value={venueData.venueName}
                    onChange={(e) => setVenueData({...venueData, venueName: e.target.value})}
                    placeholder="Enter venue name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
                  <Input
                    value={venueData.venueContactInfo}
                    onChange={(e) => setVenueData({...venueData, venueContactInfo: e.target.value})}
                    placeholder="Phone number or email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <Input
                  value={venueData.venueAddress}
                  onChange={(e) => setVenueData({...venueData, venueAddress: e.target.value})}
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <Input
                    value={venueData.venueCity}
                    onChange={(e) => setVenueData({...venueData, venueCity: e.target.value})}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <Input
                    value={venueData.venueState}
                    onChange={(e) => setVenueData({...venueData, venueState: e.target.value})}
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zipcode</label>
                  <Input
                    value={venueData.venueZipcode}
                    onChange={(e) => setVenueData({...venueData, venueZipcode: e.target.value})}
                    placeholder="Zipcode"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seat Configurations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Seat Configurations
              </CardTitle>
              <Button type="button" onClick={addSeatConfiguration} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {seatConfigurations.map((config, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Configuration {index + 1}</h4>
                    {seatConfigurations.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSeatConfiguration(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seat Type</label>
                      <select
                        value={config.seatType}
                        onChange={(e) => updateSeatConfiguration(index, 'seatType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {seatTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Row Prefix</label>
                      <select
                        value={config.rowPrefix}
                        onChange={(e) => updateSeatConfiguration(index, 'rowPrefix', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {rowPrefixes.map(prefix => (
                          <option key={prefix} value={prefix}>{prefix}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rows Count</label>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        value={config.rowsCount}
                        onChange={(e) => updateSeatConfiguration(index, 'rowsCount', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seats per Row</label>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        value={config.seatsPerRow}
                        onChange={(e) => updateSeatConfiguration(index, 'seatsPerRow', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={config.basePrice}
                        onChange={(e) => updateSeatConfiguration(index, 'basePrice', parseFloat(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={config.maxPrice}
                        onChange={(e) => updateSeatConfiguration(index, 'maxPrice', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Preview:</strong> {config.rowsCount} rows × {config.seatsPerRow} seats = {config.rowsCount * config.seatsPerRow} {config.seatType.toLowerCase()} seats
                      <br />
                      <strong>Row Format:</strong> {config.rowPrefix}1, {config.rowPrefix}2, {config.rowPrefix}3...
                      <br />
                      <strong>Seat Format:</strong> {config.rowPrefix}1-01, {config.rowPrefix}1-02, {config.rowPrefix}1-03...
                    </p>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Venue Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Total Capacity:</span>
                    <p className="font-semibold">{getTotalCapacity()} seats</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Configurations:</span>
                    <p className="font-semibold">{seatConfigurations.length}</p>
                  </div>
                  <div>
                    <span className="text-blue-600">Price Range:</span>
                    <p className="font-semibold">
                      ₹{Math.min(...seatConfigurations.map(c => c.basePrice))} - 
                      ₹{Math.max(...seatConfigurations.map(c => c.maxPrice))}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-600">Seat Types:</span>
                    <p className="font-semibold">{[...new Set(seatConfigurations.map(c => c.seatType))].join(', ')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/organizer/venues')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Venue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdvancedVenuePage;