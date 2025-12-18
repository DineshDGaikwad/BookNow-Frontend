import React, { useState, useEffect } from 'react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Clock, AlertTriangle } from 'lucide-react';

interface BookingTimerProps {
  showId: string;
  initialTimeRemaining?: number;
  onTimerExpired: () => void;
  onExtendTimer?: () => void;
  className?: string;
}

export const BookingTimer: React.FC<BookingTimerProps> = ({
  showId,
  initialTimeRemaining = 900, // 15 minutes default
  onTimerExpired,
  onExtendTimer,
  className = ''
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
  const [isExpired, setIsExpired] = useState(false);
  const [canExtend, setCanExtend] = useState(true);

  useEffect(() => {
    if (timeRemaining <= 0) {
      setIsExpired(true);
      onTimerExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsExpired(true);
          onTimerExpired();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimerExpired]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return (timeRemaining / initialTimeRemaining) * 100;
  };

  const getTimerColor = (): string => {
    if (timeRemaining <= 60) return 'text-red-600'; // Last minute
    if (timeRemaining <= 300) return 'text-orange-500'; // Last 5 minutes
    return 'text-green-600';
  };

  const getProgressColor = (): string => {
    if (timeRemaining <= 60) return 'bg-red-500';
    if (timeRemaining <= 300) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const handleExtendTimer = async () => {
    if (onExtendTimer && canExtend) {
      try {
        await onExtendTimer();
        setTimeRemaining(prev => prev + 300); // Add 5 minutes
        setCanExtend(false); // Allow only one extension
        setTimeout(() => setCanExtend(true), 60000); // Re-enable after 1 minute
      } catch (error) {
        console.error('Failed to extend timer:', error);
      }
    }
  };

  if (isExpired) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold">Booking Time Expired</span>
        </div>
        <p className="text-sm text-red-500 mt-1">
          Your seat selection has expired. Please select seats again.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Time Remaining
          </span>
        </div>
        {onExtendTimer && canExtend && timeRemaining <= 300 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExtendTimer}
            className="text-xs"
          >
            +5 min
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {formatTime(timeRemaining)}
        </div>
        
        <Progress 
          value={getProgressPercentage()} 
          className="h-2"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>0:00</span>
          <span>{formatTime(initialTimeRemaining)}</span>
        </div>
      </div>

      {timeRemaining <= 120 && (
        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
          <AlertTriangle className="h-4 w-4 inline mr-1" />
          Hurry! Complete your booking soon.
        </div>
      )}
    </div>
  );
};