import React, { useState, useEffect } from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

interface OptimisticAction {
  id: string;
  type: 'seat_select' | 'booking_create' | 'payment_process';
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: Date;
}

interface OptimisticUIProps {
  children: React.ReactNode;
}

export const OptimisticUIProvider: React.FC<OptimisticUIProps> = ({ children }) => {
  const [actions, setActions] = useState<OptimisticAction[]>([]);

  const addOptimisticAction = (action: Omit<OptimisticAction, 'id' | 'timestamp'>) => {
    const newAction: OptimisticAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setActions(prev => [...prev, newAction]);
    return newAction.id;
  };

  const updateOptimisticAction = (id: string, updates: Partial<OptimisticAction>) => {
    setActions(prev => prev.map(action => 
      action.id === id ? { ...action, ...updates } : action
    ));
  };

  const removeOptimisticAction = (id: string) => {
    setActions(prev => prev.filter(action => action.id !== id));
  };

  // Auto-remove success actions after 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActions(prev => prev.filter(action => 
        action.status !== 'success' || 
        Date.now() - action.timestamp.getTime() < 3000
      ));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <OptimisticContext.Provider value={{
      actions,
      addOptimisticAction,
      updateOptimisticAction,
      removeOptimisticAction
    }}>
      {children}
      <OptimisticNotifications actions={actions} />
    </OptimisticContext.Provider>
  );
};

const OptimisticContext = React.createContext<{
  actions: OptimisticAction[];
  addOptimisticAction: (action: Omit<OptimisticAction, 'id' | 'timestamp'>) => string;
  updateOptimisticAction: (id: string, updates: Partial<OptimisticAction>) => void;
  removeOptimisticAction: (id: string) => void;
} | null>(null);

export const useOptimisticUI = () => {
  const context = React.useContext(OptimisticContext);
  if (!context) {
    throw new Error('useOptimisticUI must be used within OptimisticUIProvider');
  }
  return context;
};

const OptimisticNotifications: React.FC<{ actions: OptimisticAction[] }> = ({ actions }) => {
  const visibleActions = actions.filter(action => 
    action.status === 'pending' || 
    (action.status === 'error' && Date.now() - action.timestamp.getTime() < 5000)
  );

  if (visibleActions.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleActions.map(action => (
        <OptimisticNotification key={action.id} action={action} />
      ))}
    </div>
  );
};

const OptimisticNotification: React.FC<{ action: OptimisticAction }> = ({ action }) => {
  const getIcon = () => {
    switch (action.status) {
      case 'pending':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getClassName = () => {
    const baseClasses = "flex items-center space-x-2 p-3 rounded-lg shadow-lg border transition-all duration-300";
    
    switch (action.status) {
      case 'pending':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 text-red-800`;
    }
  };

  return (
    <div className={getClassName()}>
      {getIcon()}
      <span className="text-sm font-medium">{action.message}</span>
    </div>
  );
};

// Hook for optimistic seat selection
export const useOptimisticSeatSelection = () => {
  const { addOptimisticAction, updateOptimisticAction } = useOptimisticUI();
  const [optimisticSeats, setOptimisticSeats] = useState<string[]>([]);

  const selectSeatOptimistically = async (seatId: string, actualSelectFn: () => Promise<boolean>) => {
    // Immediately update UI
    setOptimisticSeats(prev => [...prev, seatId]);
    
    const actionId = addOptimisticAction({
      type: 'seat_select',
      status: 'pending',
      message: `Selecting seat ${seatId}...`
    });

    try {
      const success = await actualSelectFn();
      
      if (success) {
        updateOptimisticAction(actionId, {
          status: 'success',
          message: `Seat ${seatId} selected!`
        });
      } else {
        // Revert optimistic update
        setOptimisticSeats(prev => prev.filter(id => id !== seatId));
        updateOptimisticAction(actionId, {
          status: 'error',
          message: `Failed to select seat ${seatId}`
        });
      }
    } catch (error) {
      // Revert optimistic update
      setOptimisticSeats(prev => prev.filter(id => id !== seatId));
      updateOptimisticAction(actionId, {
        status: 'error',
        message: `Error selecting seat ${seatId}`
      });
    }
  };

  return {
    optimisticSeats,
    selectSeatOptimistically
  };
};