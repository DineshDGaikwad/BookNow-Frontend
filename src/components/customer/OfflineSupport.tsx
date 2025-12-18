import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

interface OfflineData {
  events: any[];
  bookings: any[];
  userProfile: any;
  lastSync: Date;
}

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRetry(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRetry(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      setShowRetry(false);
      window.location.reload();
    }
  };

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white p-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You're offline</span>
        </div>
        {showRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRetry}
            className="text-orange-500 border-white hover:bg-white"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

export const useOfflineStorage = () => {
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);

  const saveOfflineData = (data: Partial<OfflineData>) => {
    const existingData = getOfflineData();
    const updatedData = {
      ...existingData,
      ...data,
      lastSync: new Date()
    };
    
    localStorage.setItem('booknow_offline_data', JSON.stringify(updatedData));
    setOfflineData(updatedData);
  };

  const getOfflineData = (): OfflineData => {
    const stored = localStorage.getItem('booknow_offline_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastSync: new Date(parsed.lastSync)
      };
    }
    
    return {
      events: [],
      bookings: [],
      userProfile: null,
      lastSync: new Date()
    };
  };

  const clearOfflineData = () => {
    localStorage.removeItem('booknow_offline_data');
    setOfflineData(null);
  };

  const syncWhenOnline = async () => {
    if (!navigator.onLine) return false;

    try {
      // Sync offline data with server
      const data = getOfflineData();
      
      // This would typically sync with your API
      console.log('Syncing offline data:', data);
      
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    }
  };

  useEffect(() => {
    setOfflineData(getOfflineData());

    const handleOnline = () => {
      syncWhenOnline();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return {
    offlineData,
    saveOfflineData,
    getOfflineData,
    clearOfflineData,
    syncWhenOnline,
    isOffline: !navigator.onLine
  };
};

export const OfflineBrowsing: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { offlineData, isOffline } = useOfflineStorage();

  if (isOffline && (!offlineData || offlineData.events.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            You're Offline
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            No internet connection detected. Some features may be limited until you're back online.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <OfflineIndicator />
      {children}
    </>
  );
};