import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Eye, EyeOff, DollarSign, Save, RotateCcw } from 'lucide-react';
import { RootState } from '../../store';
import { venueAPI } from '../../services/venueAPI';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'react-toastify';

interface Seat {
  seatId: string;
  seatRowNumber: string;
  seatNumber: string;
  seatType: string;
  isActive: boolean;
  basePrice: number;
  maxPrice: number;
}

interface SeatTypeConfig {
  seatType: string;
  basePrice: number;
  maxPrice: number;
  totalSeats: number;
  activeSeats: number;
}

const VenueSeatManagement: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatConfigs, setSeatConfigs] = useState<SeatTypeConfig[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadVenueSeats();
  }, [venueId]);

  const loadVenueSeats = async () => {
    try {
      if (!user?.userId || !venueId) return;
      
      const data = await venueAPI.getVenueSeats(venueId, user.userId);
      setSeats(data.seats || []);
      setSeatConfigs(data.configurations || []);
      setLoading(false);
      return;
      
      // Fallback to mock data if API not ready
      const mockSeats: Seat[] = [];
      const seatTypes = ['Regular', 'Premium', 'VIP'];
      const rowPrefixes = ['A', 'P', 'V'];
      
      seatTypes.forEach((type, typeIndex) => {
        const rowCount = type === 'Regular' ? 10 : type === 'Premium' ? 3 : 2;
        const seatsPerRow = type === 'Regular' ? 10 : type === 'Premium' ? 8 : 6;
        const basePrice = type === 'Regular' ? 299 : type === 'Premium' ? 599 : 999;
        
        for (let row = 1; row <= rowCount; row++) {
          for (let seat = 1; seat <= seatsPerRow; seat++) {
            mockSeats.push({
              seatId: `${type}-${row}-${seat}`,
              seatRowNumber: `${rowPrefixes[typeIndex]}${row}`,
              seatNumber: seat.toString().padStart(2, '0'),
              seatType: type,
              isActive: Math.random() > 0.1, // 90% active
              basePrice,
              maxPrice: basePrice * 2
            });
          }
        }
      });

      setSeats(mockSeats);
      
      // Calculate seat type configurations
      const configs = seatTypes.map(type => {
        const typeSeats = mockSeats.filter(s => s.seatType === type);
        return {
          seatType: type,
          basePrice: typeSeats[0]?.basePrice || 0,
          maxPrice: typeSeats[0]?.maxPrice || 0,
          totalSeats: typeSeats.length,
          activeSeats: typeSeats.filter(s => s.isActive).length
        };
      });
      
      setSeatConfigs(configs);
    } catch (error) {
      toast.error('Failed to load venue seats');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeatSelection = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const toggleSelectedSeatsStatus = async (activate: boolean) => {
    if (selectedSeats.length === 0) {
      toast.error('Please select seats first');
      return;
    }

    try {
      if (!user?.userId || !venueId) return;
      
      await venueAPI.updateSeatStatus(venueId, user.userId, {
        seatIds: selectedSeats,
        isActive: activate
      });
      
      setSeats(prev => prev.map(seat => 
        selectedSeats.includes(seat.seatId) 
          ? { ...seat, isActive: activate }
          : seat
      ));
      
      setSelectedSeats([]);
      toast.success(`${selectedSeats.length} seats ${activate ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update seat status');
    }
  };

  const updateSeatTypePricing = async (seatType: string, basePrice: number, maxPrice: number) => {
    try {
      if (!user?.userId || !venueId) return;
      
      await venueAPI.updateSeatPricing(venueId, user.userId, {
        seatType,
        basePrice,
        maxPrice
      });
      
      setSeats(prev => prev.map(seat => 
        seat.seatType === seatType 
          ? { ...seat, basePrice, maxPrice }
          : seat
      ));
      
      setSeatConfigs(prev => prev.map(config => 
        config.seatType === seatType 
          ? { ...config, basePrice, maxPrice }
          : config
      ));
      
      toast.success(`${seatType} pricing updated`);
    } catch (error) {
      toast.error('Failed to update pricing');
    }
  };

  const getSeatsByRow = () => {
    const seatsByRow: { [key: string]: Seat[] } = {};
    seats.forEach(seat => {
      if (!seatsByRow[seat.seatRowNumber]) {
        seatsByRow[seat.seatRowNumber] = [];
      }
      seatsByRow[seat.seatRowNumber].push(seat);
    });
    
    return Object.keys(seatsByRow)
      .sort()
      .map(row => ({
        row,
        seats: seatsByRow[row].sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber))
      }));
  };

  const getSeatClass = (seat: Seat) => {
    const baseClass = "w-8 h-8 rounded text-xs font-bold border-2 cursor-pointer transition-all";
    const isSelected = selectedSeats.includes(seat.seatId);
    
    if (isSelected) return `${baseClass} bg-blue-500 border-blue-600 text-white`;
    if (!seat.isActive) return `${baseClass} bg-red-200 border-red-400 text-red-800`;
    
    switch (seat.seatType) {
      case 'VIP': return `${baseClass} bg-yellow-200 border-yellow-400 text-yellow-800 hover:bg-yellow-300`;
      case 'Premium': return `${baseClass} bg-purple-200 border-purple-400 text-purple-800 hover:bg-purple-300`;
      default: return `${baseClass} bg-green-200 border-green-400 text-green-800 hover:bg-green-300`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seat Management</h1>
          <p className="text-gray-600">Manage seat status and pricing for your venue</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Seat Type Configurations */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {seatConfigs.map(config => (
                  <div key={config.seatType} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={config.seatType === 'VIP' ? 'gold' : config.seatType === 'Premium' ? 'secondary' : 'outline'}>
                        {config.seatType}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {config.activeSeats}/{config.totalSeats}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-600">Base Price</label>
                        <Input
                          type="number"
                          value={config.basePrice}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value);
                            setSeatConfigs(prev => prev.map(c => 
                              c.seatType === config.seatType 
                                ? { ...c, basePrice: newPrice }
                                : c
                            ));
                          }}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Max Price</label>
                        <Input
                          type="number"
                          value={config.maxPrice}
                          onChange={(e) => {
                            const newPrice = parseFloat(e.target.value);
                            setSeatConfigs(prev => prev.map(c => 
                              c.seatType === config.seatType 
                                ? { ...c, maxPrice: newPrice }
                                : c
                            ));
                          }}
                          className="h-8"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => updateSeatTypePricing(config.seatType, config.basePrice, config.maxPrice)}
                        className="w-full"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Selected Seats Actions */}
            {selectedSeats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Seats ({selectedSeats.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => toggleSelectedSeatsStatus(true)}
                    className="w-full"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                  <Button
                    onClick={() => toggleSelectedSeatsStatus(false)}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                  <Button
                    onClick={() => setSelectedSeats([])}
                    variant="ghost"
                    className="w-full"
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear Selection
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Seat Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Seat Layout</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Stage */}
                <div className="mb-8 text-center">
                  <div className="inline-block px-16 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold">
                    STAGE
                  </div>
                </div>

                {/* Seat Grid */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getSeatsByRow().map(({ row, seats: rowSeats }) => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-8 text-center font-bold text-gray-600 text-sm">{row}</span>
                      <div className="flex gap-1">
                        {rowSeats.map(seat => (
                          <button
                            key={seat.seatId}
                            onClick={() => toggleSeatSelection(seat.seatId)}
                            className={getSeatClass(seat)}
                            title={`${seat.seatRowNumber}-${seat.seatNumber} (${seat.seatType}) - ₹${seat.basePrice}-₹${seat.maxPrice} - ${seat.isActive ? 'Active' : 'Inactive'}`}
                          >
                            {seat.seatNumber}
                          </button>
                        ))}
                      </div>
                      <span className="w-8 text-center font-bold text-gray-600 text-sm">{row}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-200 border-2 border-green-400" />
                    <span className="text-sm">Regular (Active)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-200 border-2 border-purple-400" />
                    <span className="text-sm">Premium (Active)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-yellow-200 border-2 border-yellow-400" />
                    <span className="text-sm">VIP (Active)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-red-200 border-2 border-red-400" />
                    <span className="text-sm">Inactive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-500 border-2 border-blue-600" />
                    <span className="text-sm">Selected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueSeatManagement;