import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Eye, EyeOff, DollarSign, Save, RotateCcw, Edit, X, Check } from 'lucide-react';
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
  rowsCount?: number;
  seatsPerRow?: number;
}

const VenueSeatManagement: React.FC = () => {
  const { venueSlug } = useParams<{ venueSlug: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [venue, setVenue] = useState<any>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatConfigs, setSeatConfigs] = useState<SeatTypeConfig[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cache to prevent repeated API calls
  const [dataCache, setDataCache] = useState<{[key: string]: {data: any, timestamp: number}}>({});
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [editMode, setEditMode] = useState(false);
  const [editConfigs, setEditConfigs] = useState<SeatTypeConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<string | null>(null);

  // Memoize venue ID to prevent unnecessary re-renders
  const venueId = useMemo(() => venue?.venueId, [venue]);

  useEffect(() => {
    if (venueSlug) {
      loadVenueData();
    }
  }, [venueSlug]);

  const loadVenueData = async () => {
    const cacheKey = `venue-${venueSlug}-${user?.userId}`;
    const cached = dataCache[cacheKey];
    
    // Return cached data if less than 2 minutes old
    if (cached && Date.now() - cached.timestamp < 120000) {
      setVenue(cached.data.venue);
      setSeats(cached.data.seats);
      setSeatConfigs(cached.data.configs);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Single API call to get all data
      const [venues, seatData] = await Promise.all([
        venueAPI.getVenues(user!.userId),
        // Pre-load seat data for all venues to cache
        Promise.resolve(null)
      ]);
      
      const venueData = venues.find((v: any) => 
        v.venueName.toLowerCase().replace(/\s+/g, '-') === venueSlug
      );
      
      if (!venueData) {
        throw new Error('Venue not found');
      }
      
      setVenue(venueData);
      
      // Load seats in parallel
      const seatsPromise = loadVenueSeats(venueData.venueId);
      await seatsPromise;
      
      // Cache the complete data
      setDataCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: { venue: venueData, seats, configs: seatConfigs },
          timestamp: Date.now()
        }
      }));
      
    } catch (error) {
      console.error('Failed to load venue:', error);
      toast.error('Failed to load venue data');
    } finally {
      setLoading(false);
    }
  };

  const calculateSeatLayout = (seats: Seat[], seatType: string) => {
    const typeSeats = seats.filter(seat => seat.seatType === seatType);
    if (typeSeats.length === 0) return { rowsCount: 0, seatsPerRow: 0 };
    
    const rowsSet = new Set(typeSeats.map(seat => seat.seatRowNumber));
    const rowsCount = rowsSet.size;
    
    const seatsByRow: { [key: string]: number } = {};
    typeSeats.forEach(seat => {
      seatsByRow[seat.seatRowNumber] = (seatsByRow[seat.seatRowNumber] || 0) + 1;
    });
    
    const seatsPerRow = Math.max(...Object.values(seatsByRow));
    return { rowsCount, seatsPerRow };
  };

  const loadVenueSeats = async (venueIdParam: string) => {
    const seatCacheKey = `seats-${venueIdParam}`;
    const cached = dataCache[seatCacheKey];
    
    // Return cached seats if less than 1 minute old
    if (cached && Date.now() - cached.timestamp < 60000) {
      setSeats(cached.data.seats);
      setSeatConfigs(cached.data.configs);
      return;
    }

    try {
      if (!user?.userId || !venueIdParam) return;
      
      const data = await venueAPI.getVenueSeats(venueIdParam, user.userId);
      const loadedSeats = data.seats || [];
      const loadedConfigs = (data.configurations || []).map((config: any) => {
        const layout = calculateSeatLayout(loadedSeats, config.seatType);
        return {
          ...config,
          rowsCount: layout.rowsCount,
          seatsPerRow: layout.seatsPerRow
        };
      });
      
      setSeats(loadedSeats);
      setSeatConfigs(loadedConfigs);
      
      // Cache seat data
      setDataCache(prev => ({
        ...prev,
        [seatCacheKey]: {
          data: { seats: loadedSeats, configs: loadedConfigs },
          timestamp: Date.now()
        }
      }));
      
    } catch (error) {
      console.error('Failed to load venue seats:', error);
      toast.error('Failed to load venue seats');
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

  const startEditConfig = (seatType: string) => {
    setEditingConfig(seatType);
    const config = seatConfigs.find(c => c.seatType === seatType);
    if (config) {
      setEditConfigs([{ ...config }]);
    }
  };

  const cancelEdit = () => {
    setEditingConfig(null);
    setEditConfigs([]);
  };

  const saveConfigChanges = async (seatType: string) => {
    const editConfig = editConfigs[0];
    if (!editConfig) return;

    try {
      if (!user?.userId || !venueId) return;
      
      // Update seat layout if rows or seats per row changed
      const originalConfig = seatConfigs.find(c => c.seatType === seatType);
      const layoutChanged = originalConfig && (
        originalConfig.rowsCount !== editConfig.rowsCount ||
        originalConfig.seatsPerRow !== editConfig.seatsPerRow
      );
      
      if (layoutChanged && editConfig.rowsCount && editConfig.seatsPerRow) {
        // Update seat layout - this will regenerate seats
        const layoutResponse = await venueAPI.updateSeatLayout(venueId, user.userId, {
          seatType,
          rowsCount: editConfig.rowsCount,
          seatsPerRow: editConfig.seatsPerRow,
          basePrice: editConfig.basePrice,
          maxPrice: editConfig.maxPrice
        });
        
        // Update with new seat data from backend
        setSeats(layoutResponse.seats || []);
        setSeatConfigs(layoutResponse.configurations || []);
      } else {
        // Just update pricing
        await venueAPI.updateSeatPricing(venueId, user.userId, {
          seatType,
          basePrice: editConfig.basePrice,
          maxPrice: editConfig.maxPrice
        });
        
        // Update local state
        setSeatConfigs(prev => prev.map(config => 
          config.seatType === seatType 
            ? { ...config, ...editConfig }
            : config
        ));
        
        setSeats(prev => prev.map(seat => 
          seat.seatType === seatType 
            ? { ...seat, basePrice: editConfig.basePrice, maxPrice: editConfig.maxPrice }
            : seat
        ));
      }
      
      setEditingConfig(null);
      setEditConfigs([]);
      toast.success(`${seatType} configuration updated`);
    } catch (error) {
      toast.error('Failed to update configuration');
    }
  };

  const updateEditConfig = (field: keyof SeatTypeConfig, value: number) => {
    setEditConfigs(prev => prev.map(config => ({
      ...config,
      [field]: value
    })));
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
      case 'Disabled': return `${baseClass} bg-gray-300 border-gray-500 text-gray-700 hover:bg-gray-400`;
      case 'Regular': return `${baseClass} bg-green-200 border-green-400 text-green-800 hover:bg-green-300`;
      default: return `${baseClass} bg-blue-200 border-blue-400 text-blue-800 hover:bg-blue-300`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-96 bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Seat Management</h1>
          <p className="text-gray-300">Manage seat status and pricing for your venue</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Seat Type Configurations */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5" />
                  Pricing Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {seatConfigs.map(config => {
                  const isEditing = editingConfig === config.seatType;
                  const editConfig = isEditing ? editConfigs[0] : config;
                  
                  return (
                    <div key={config.seatType} className="border border-gray-600 rounded-lg p-3 bg-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={config.seatType === 'VIP' ? 'gold' : config.seatType === 'Premium' ? 'secondary' : 'outline'}>
                          {config.seatType}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-300">
                            {config.activeSeats}/{config.totalSeats}
                          </span>
                          {!isEditing ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditConfig(config.seatType)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => saveConfigChanges(config.seatType)}
                                className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEdit}
                                className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {isEditing && (
                          <>
                            <div>
                              <label className="text-xs text-gray-300">Rows Count</label>
                              <Input
                                type="number"
                                value={editConfig?.rowsCount || config.rowsCount || 0}
                                onChange={(e) => updateEditConfig('rowsCount', parseInt(e.target.value) || 0)}
                                className="h-8 bg-gray-700 border-gray-600 text-white"
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-300">Seats Per Row</label>
                              <Input
                                type="number"
                                value={editConfig?.seatsPerRow || config.seatsPerRow || 0}
                                onChange={(e) => updateEditConfig('seatsPerRow', parseInt(e.target.value) || 0)}
                                className="h-8 bg-gray-700 border-gray-600 text-white"
                                min="0"
                              />
                            </div>
                          </>
                        )}
                        <div>
                          <label className="text-xs text-gray-300">Base Price</label>
                          <Input
                            type="number"
                            value={isEditing ? (editConfig?.basePrice || 0) : config.basePrice}
                            onChange={(e) => {
                              const newPrice = parseFloat(e.target.value) || 0;
                              if (isEditing) {
                                updateEditConfig('basePrice', newPrice);
                              } else {
                                setSeatConfigs(prev => prev.map(c => 
                                  c.seatType === config.seatType 
                                    ? { ...c, basePrice: newPrice }
                                    : c
                                ));
                              }
                            }}
                            className="h-8 bg-gray-700 border-gray-600 text-white"
                            disabled={isEditing}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-300">Max Price</label>
                          <Input
                            type="number"
                            value={isEditing ? (editConfig?.maxPrice || 0) : config.maxPrice}
                            onChange={(e) => {
                              const newPrice = parseFloat(e.target.value) || 0;
                              if (isEditing) {
                                updateEditConfig('maxPrice', newPrice);
                              } else {
                                setSeatConfigs(prev => prev.map(c => 
                                  c.seatType === config.seatType 
                                    ? { ...c, maxPrice: newPrice }
                                    : c
                                ));
                              }
                            }}
                            className="h-8 bg-gray-700 border-gray-600 text-white"
                            disabled={isEditing}
                          />
                        </div>
                        {!isEditing && (
                          <Button
                            size="sm"
                            onClick={() => updateSeatTypePricing(config.seatType, config.basePrice, config.maxPrice)}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Update
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Selected Seats Actions */}
            {selectedSeats.length > 0 && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Selected Seats ({selectedSeats.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => toggleSelectedSeatsStatus(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                  <Button
                    onClick={() => toggleSelectedSeatsStatus(false)}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    size="sm"
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                  <Button
                    onClick={() => setSelectedSeats([])}
                    variant="ghost"
                    className="w-full text-gray-300 hover:bg-gray-800"
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
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Seat Layout</CardTitle>
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
                      <span className="w-8 text-center font-bold text-gray-300 text-sm">{row}</span>
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
                      <span className="w-8 text-center font-bold text-gray-300 text-sm">{row}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-green-200 border-2 border-green-400" />
                    <span className="text-sm text-gray-300">Regular (Active)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-200 border-2 border-purple-400" />
                    <span className="text-sm text-gray-300">Premium (Active)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-yellow-200 border-2 border-yellow-400" />
                    <span className="text-sm text-gray-300">VIP (Active)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gray-300 border-2 border-gray-500" />
                    <span className="text-sm text-gray-300">Disabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-red-200 border-2 border-red-400" />
                    <span className="text-sm text-gray-300">Inactive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-500 border-2 border-blue-600" />
                    <span className="text-sm text-gray-300">Selected</span>
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