import { useState, useEffect, useCallback, useRef } from 'react';
import { customerAPI, SeatInfo } from '../services/customerAPI';
import { toast } from 'react-toastify';

export const useRealTimeSeats = (showId: string | undefined) => {
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [seatUpdateLoading, setSeatUpdateLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const userId = localStorage.getItem('userId') || `user_${Date.now()}`;

  // Initialize userId if not exists
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  // Load initial seat data only
  useEffect(() => {
    if (!showId) return;

    loadSeats();

    return () => {
      // Clean up on unmount
    };
  }, [showId]);

  const loadSeats = async (page: number = 1, append: boolean = false) => {
    if (!showId) return;
    
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      
      const seatData = await customerAPI.getShowSeats(showId, page, 50); // Smaller page size
      
      if (append) {
        setSeats(prev => [...prev, ...(seatData.seats || [])]);
      } else {
        setSeats(seatData.seats || []);
      }
      
      setCurrentPage(seatData.currentPage || 1);
      setTotalPages(seatData.totalPages || 1);
    } catch (error) {
      console.error('Failed to load seats:', error);
      toast.error('Failed to load seat information');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreSeats = () => {
    if (currentPage < totalPages && !loadingMore) {
      loadSeats(currentPage + 1, true);
    }
  };

  const refreshSeatStatus = useCallback(async () => {
    // Disabled for now
  }, []);

  const startRealTimeUpdates = () => {
    // Disabled for now
  };

  const stopRealTimeUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const selectSeat = async (seat: SeatInfo): Promise<boolean> => {
    const seatKey = seat.showSeatId || seat.seatId;
    
    if (seat.status === 'Booked' || seatUpdateLoading === seatKey) {
      return false;
    }

    setSeatUpdateLoading(seatKey);

    try {
      if (selectedSeats.includes(seatKey)) {
        // Deselect seat (local only)
        setSelectedSeats(prev => prev.filter(id => id !== seatKey));
        toast.success(`Seat deselected`);
      } else {
        // Select seat (limit to 6 seats)
        if (selectedSeats.length >= 6) {
          toast.error('Maximum 6 seats can be selected');
          return false;
        }

        // Select seat (local only)
        setSelectedSeats(prev => [...prev, seatKey]);
        toast.success(`Seat selected`);
      }

      return true;
    } catch (error: any) {
      toast.error('Failed to select seat');
      return false;
    } finally {
      setSeatUpdateLoading(null);
    }
  };

  const releaseAllSelections = async () => {
    if (!showId) return;
    
    try {
      await customerAPI.releaseUserSelection(userId, showId);
      setSelectedSeats([]);
      await refreshSeatStatus();
    } catch (error) {
      console.error('Failed to release selections:', error);
    }
  };

  const getSeatClass = (seat: SeatInfo): string => {
    const seatKey = seat.showSeatId || seat.seatId;
    
    if (selectedSeats.includes(seatKey)) return 'bg-blue-500 border-blue-600 text-white';
    if (seat.status === 'Booked') return 'bg-gray-400 border-gray-500 cursor-not-allowed text-white';
    if (seat.status === 'Locked' && seat.lockedBy !== userId) return 'bg-orange-300 border-orange-400 cursor-not-allowed';
    
    // Color by seat type
    const seatType = seat.section || 'Regular';
    if (seatType === 'Premium') return 'bg-purple-200 border-purple-400 hover:bg-purple-300 cursor-pointer';
    if (seatType === 'VIP') return 'bg-yellow-200 border-yellow-400 hover:bg-yellow-300 cursor-pointer';
    return 'bg-green-200 border-green-400 hover:bg-green-300 cursor-pointer';
  };

  const isSeatDisabled = (seat: SeatInfo): boolean => {
    const seatKey = seat.showSeatId || seat.seatId;
    return seat.status === 'Booked' || 
           (seat.status === 'Locked' && seat.lockedBy !== userId) || 
           seatUpdateLoading === seatKey;
  };

  const getSelectedSeatsData = (): SeatInfo[] => {
    return seats.filter(seat => {
      const seatKey = seat.showSeatId || seat.seatId;
      return selectedSeats.includes(seatKey);
    }).map(seat => ({
      ...seat,
      price: seat.seatPrice || seat.price || 0,
      section: seat.seatType || seat.section || 'Regular'
    }));
  };

  const getTotalPrice = (): number => {
    return getSelectedSeatsData().reduce((sum, seat) => sum + (seat.price || 0), 0);
  };

  return {
    seats,
    selectedSeats,
    loading,
    seatUpdateLoading,
    loadingMore,
    currentPage,
    totalPages,
    selectSeat,
    releaseAllSelections,
    getSeatClass,
    isSeatDisabled,
    getSelectedSeatsData,
    getTotalPrice,
    refreshSeatStatus,
    loadMoreSeats,
    userId
  };
};