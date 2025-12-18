import React from 'react';
import { Loader2 } from 'lucide-react';

export const EventCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export const SeatMapSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
    <div className="grid grid-cols-10 gap-2">
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="h-8 bg-gray-300 rounded"></div>
      ))}
    </div>
  </div>
);

export const BookingFormSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg p-6 animate-pulse">
    <div className="space-y-4">
      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
      <div className="h-10 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export const FullPageLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export const InlineLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
  );
};