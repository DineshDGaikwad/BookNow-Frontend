import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface OfflineModeProps {
  onRetry: () => void;
  message?: string;
}

export const OfflineMode: React.FC<OfflineModeProps> = ({ onRetry, message }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
        Backend Unavailable
      </h3>
      <p className="text-yellow-700 mb-4">
        {message || "The server is currently unavailable. Some features may not work properly."}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry Connection
      </button>
    </div>
  );
};