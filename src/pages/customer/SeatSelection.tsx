import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ZoomIn, ZoomOut, RotateCcw, AlertCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { customerAPI, ShowDetails } from '../../services/customerAPI';
import { cn } from '../../lib/utils';
import { toast } from 'react-toastify';
import { useRealTimeSeats } from '../../hooks/useRealTimeSeats';

const SeatSelection: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState<ShowDetails | null>(null);
  const [showLoading, setShowLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  
  const {
    seats,
    selectedSeats,
    loading: seatsLoading,
    seatUpdateLoading,
    loadingMore,
    currentPage,
    totalPages,
    selectSeat,
    getSeatClass,
    isSeatDisabled,
    getSelectedSeatsData,
    getTotalPrice,
    loadMoreSeats,
    userId
  } = useRealTimeSeats(showId);

  useEffect(() => {
    if (showId) {
      loadShowDetails();
    }
  }, [showId]);

  const loadShowDetails = async () => {
    try {
      const showData = await customerAPI.getShowDetails(showId!);
      setShowDetails(showData);
    } catch (error) {
      console.error('Failed to load show details:', error);
      toast.error('Failed to load show details');
    } finally {
      setShowLoading(false);
    }
  };



  const selectedSeatsData = getSelectedSeatsData();
  const totalPrice = getTotalPrice();



  const handleProceed = async () => {
    if (selectedSeats.length === 0) return;
    
    try {
      // Get show seat IDs for validation
      const showSeatIds = selectedSeatsData
        .map(seat => seat.showSeatId)
        .filter(id => id) as string[];
      
      if (showSeatIds.length !== selectedSeats.length) {
        toast.error('Some seat information is missing. Please refresh and try again.');
        return;
      }
      
      // Validate seats before proceeding
      const validation = await customerAPI.validateSeats(userId, showSeatIds);
      
      if (!validation.isValid) {
        toast.error(validation.message || 'Some selected seats are no longer available');
        // Refresh seat status to show current state
        window.location.reload();
        return;
      }
      
      navigate('/checkout', { 
        state: { 
          selectedSeats: selectedSeatsData, 
          showId, 
          showDetails,
          showSeatIds 
        } 
      });
    } catch (error: any) {
      console.error('Failed to validate seats:', error);
      toast.error('Failed to validate seat selection. Please try again.');
    }
  };

  // Generate optimized seat layout
  const generateSeatLayout = () => {
    if (seats.length === 0) return [];
    
    // Group seats by row and sort
    const seatsByRow = seats.reduce((acc, seat) => {
      const row = seat.row || seat.seatRowNumber || 'R01';
      if (!acc[row]) acc[row] = [];
      acc[row].push(seat);
      return acc;
    }, {} as Record<string, typeof seats>);

    return Object.keys(seatsByRow)
      .sort()
      .slice(0, 20) // Limit to 20 rows for performance
      .map(row => ({
        row,
        seats: seatsByRow[row]
          .sort((a, b) => {
            const aNum = parseInt((a.seatNumber || '0').replace(/\D/g, ''));
            const bNum = parseInt((b.seatNumber || '0').replace(/\D/g, ''));
            return aNum - bNum;
          })
          .slice(0, 20) // Limit to 20 seats per row
      }));
  };

  if (showLoading || seatsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container px-4 py-6 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!showDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container px-4 py-6 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Show Not Found</h1>
          <Link to="/events" className="text-blue-500 hover:underline">← Back to Events</Link>
        </div>
      </div>
    );
  }

  const seatLayout = generateSeatLayout();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/events" className="hover:text-gray-900">Events</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/events/${showDetails.eventId}`} className="hover:text-gray-900">{showDetails.eventTitle}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">Select Seats</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Select Your Seats</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stage */}
                <div className="mb-8 text-center">
                  <div className="inline-block px-16 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold">
                    STAGE
                  </div>
                </div>

                {/* Seat Map */}
                {seats.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🎫</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Seats Available</h3>
                    <p className="text-gray-600 mb-4">Seats for this show haven't been configured yet.</p>
                    <p className="text-sm text-gray-500">Please check back later or contact the organizer.</p>
                  </div>
                ) : (
                  <div className="overflow-auto max-h-96">
                    <div 
                      className="min-w-[600px] space-y-1 p-4"
                      style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
                    >
                      {seatLayout.map(({ row, seats: rowSeats }) => (
                        <div key={row} className="flex items-center justify-center gap-1">
                          <span className="w-8 text-xs font-bold text-gray-600 text-center">{row}</span>
                          <div className="flex gap-0.5">
                            {rowSeats.map((seat) => (
                              <button
                                key={seat.seatId || seat.showSeatId}
                                onClick={() => selectSeat(seat)}
                                className={cn(
                                  "w-6 h-6 rounded text-[8px] font-bold transition-all relative border",
                                  getSeatClass(seat),
                                  seatUpdateLoading === seat.seatId && "animate-pulse"
                                )}
                                disabled={isSeatDisabled(seat)}
                                title={`${seat.seatNumber || seat.seatId} - ₹${seat.price} - ${seat.status}`}
                              >
                                {(seat.seatNumber || seat.seatId || '').slice(-2)}
                                {seatUpdateLoading === seat.seatId && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                                    <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          <span className="w-8 text-xs font-bold text-gray-600 text-center">{row}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Load More Button */}
                    {currentPage < totalPages && (
                      <div className="text-center mt-4">
                        <Button 
                          onClick={loadMoreSeats}
                          disabled={loadingMore}
                          variant="outline"
                        >
                          {loadingMore ? 'Loading...' : `Load More Seats (${currentPage}/${totalPages})`}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-t-lg bg-green-200 border-2 border-green-400" />
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-t-lg bg-blue-500 border-2 border-blue-600" />
                    <span className="text-sm">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-t-lg bg-gray-300 border-2 border-gray-400" />
                    <span className="text-sm">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-t-lg bg-orange-200 border-2 border-orange-400" />
                    <span className="text-sm">Being Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-t-lg bg-purple-200 border-2 border-purple-400" />
                    <span className="text-sm">Premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-t-lg bg-yellow-200 border-2 border-yellow-400" />
                    <span className="text-sm">VIP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">{showDetails.eventTitle}</p>
                  <p>{new Date(showDetails.showStartTime).toLocaleDateString()} • {new Date(showDetails.showStartTime).toLocaleTimeString()}</p>
                  <p>{showDetails.venueName}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold mb-2">Selected Seats ({selectedSeats.length})</h4>
                  {selectedSeats.length === 0 ? (
                    <p className="text-sm text-gray-500">No seats selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedSeatsData.map((seat) => (
                        <div key={seat.seatId} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant={seat.section === 'VIP' ? 'gold' : seat.section === 'PREMIUM' ? 'secondary' : 'outline'} className="text-xs">
                              {seat.seatId}
                            </Badge>
                            <span className="text-gray-600">{seat.section}</span>
                          </div>
                          <span>₹{seat.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Convenience Fee</span>
                    <span>₹{Math.round(totalPrice * 0.05)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-blue-600">₹{totalPrice + Math.round(totalPrice * 0.05)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={selectedSeats.length === 0 || seatUpdateLoading !== null}
                  onClick={handleProceed}
                >
                  {seatUpdateLoading ? 'Updating...' : 'Proceed to Checkout'}
                </Button>

                {selectedSeats.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>Seats will be held for 10 minutes</span>
                  </div>
                )}

                <p className="text-xs text-center text-gray-500">
                  Seats held for 10 minutes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SeatSelection;