import React, { useState, useEffect } from 'react';
import { AdminAction } from '../../types/admin.types';
import adminService from '../../services/adminService';

const RecentActions: React.FC = () => {
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActions();
  }, []);

  const loadRecentActions = async () => {
    try {
      const data = await adminService.getRecentActions();
      setActions(data);
    } catch (error) {
      console.error('Failed to load recent actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'ApprovalGranted': return 'text-green-600 bg-green-50';
      case 'UserSuspended': return 'text-red-600 bg-red-50';
      case 'ApprovalRejected': return 'text-orange-600 bg-orange-50';
      case 'SystemSettingUpdated': return 'text-blue-600 bg-blue-50';
      case 'UserActivated': return 'text-green-600 bg-green-50';
      case 'RoleChanged': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'ApprovalGranted': return '✅';
      case 'UserSuspended': return '🚫';
      case 'ApprovalRejected': return '❌';
      case 'SystemSettingUpdated': return '⚙️';
      case 'UserActivated': return '✅';
      case 'RoleChanged': return '👤';
      default: return 'ℹ️';
    }
  };

  const formatActionType = (actionType: string | any) => {
    if (typeof actionType !== 'string') {
      return String(actionType);
    }
    return actionType.replace(/([A-Z])/g, ' $1').trim();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const actionDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - actionDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Actions</h3>
        <p className="text-sm text-gray-600 mt-1">Latest administrative activities</p>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : actions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No recent actions</h4>
            <p className="text-gray-500">Administrative activities will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {actions.map((action) => (
              <div key={action.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActionColor(action.actionType)}`}>
                  {getActionIcon(action.actionType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {formatActionType(action.actionType)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTimeAgo(action.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActions;