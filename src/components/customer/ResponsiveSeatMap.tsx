import React, { useState, useEffect } from 'react';
import { Check, X, User, Accessibility } from 'lucide-react';

interface Seat {
  id: string;
  row: string;
  number: number;
  category: string;
  price: number;
  isBooked: boolean;
  isLocked: boolean;
  isAccessible: boolean;
}

interface ResponsiveSeatMapProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  onSeatDeselect: (seatId: string) => void;
  maxSeats?: number;
}

export const ResponsiveSeatMap: React.FC<ResponsiveSeatMapProps> = ({
  seats,
  selectedSeats,
  onSeatSelect,
  onSeatDeselect,
  maxSeats = 8
}) => {
  const [seatsByRow, setSeatsByRow] = useState<{ [key: string]: Seat[] }>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const grouped = seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {} as { [key: string]: Seat[] });

    // Sort seats within each row
    Object.keys(grouped).forEach(row => {
      grouped[row].sort((a, b) => a.number - b.number);
    });

    setSeatsByRow(grouped);
  }, [seats]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked || seat.isLocked) return;

    if (selectedSeats.includes(seat.id)) {
      onSeatDeselect(seat.id);
    } else if (selectedSeats.length < maxSeats) {
      onSeatSelect(seat.id);
    }
  };

  const getSeatClassName = (seat: Seat) => {
    const baseClasses = "w-8 h-8 m-1 rounded-lg border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200";
    
    if (seat.isBooked) {
      return `${baseClasses} bg-red-100 border-red-300 text-red-600 cursor-not-allowed`;
    }
    
    if (seat.isLocked) {
      return `${baseClasses} bg-yellow-100 border-yellow-300 text-yellow-600 cursor-not-allowed`;
    }
    
    if (selectedSeats.includes(seat.id)) {
      return `${baseClasses} bg-blue-500 border-blue-600 text-white shadow-lg scale-110`;
    }

    const categoryColors = {
      VIP: 'bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200',
      Premium: 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200',
      Standard: 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200',
      Economy: 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
    };

    return `${baseClasses} ${categoryColors[seat.category as keyof typeof categoryColors] || categoryColors.Standard}`;
  };

  const getSeatIcon = (seat: Seat) => {
    if (seat.isBooked) return <X className="w-4 h-4" />;
    if (seat.isLocked) return <User className="w-4 h-4" />;
    if (selectedSeats.includes(seat.id)) return <Check className="w-4 h-4" />;
    if (seat.isAccessible) return <Accessibility className="w-3 h-3" />;
    return seat.number;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      {/* Stage */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg p-4 text-center">
          <div className="text-gray-600 font-medium">STAGE</div>
        </div>
      </div>

      {/* Seat Map */}
      <div className={`overflow-x-auto ${isMobile ? 'pb-4' : ''}`}>
        <div className="min-w-max">
          {Object.entries(seatsByRow)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([row, rowSeats]) => (
              <div key={row} className="flex items-center mb-2">
                <div className="w-8 text-center font-medium text-gray-600 mr-2">
                  {row}
                </div>
                <div className="flex">
                  {rowSeats.map((seat, index) => (
                    <div
                      key={seat.id}
                      className={getSeatClassName(seat)}
                      onClick={() => handleSeatClick(seat)}
                      title={`Row ${seat.row}, Seat ${seat.number} - ${seat.category} - $${seat.price}`}
                    >
                      {getSeatIcon(seat)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
          <span>Locked</span>
        </div>
        <div className="flex items-center">
          <Accessibility className="w-4 h-4 mr-2" />
          <span>Accessible</span>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-800">
            Selected: {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Maximum {maxSeats} seats allowed
          </div>
        </div>
      )}
    </div>
  );
};