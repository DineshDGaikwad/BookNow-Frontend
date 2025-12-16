import React, { useEffect, useState } from 'react';

interface AdminAction {
  id: string;
  action: string;
  target: string;
  admin: string;
  timestamp: string;
  type: 'approval' | 'user' | 'system';
}

const RecentActions: React.FC = () => {
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API
    // Mock data for now
    setTimeout(() => {
      setActions([
        {
          id: '1',
          action: 'Approved organizer registration',
          target: 'EventPro Ltd.',
          admin: 'Admin User',
          timestamp: '2024-01-15T10:30:00Z',
          type: 'approval'
        },
        {
          id: '2',
          action: 'Suspended user account',
          target: 'user@example.com',
          admin: 'Admin User',
          timestamp: '2024-01-15T09:15:00Z',
          type: 'user'
        },
        {
          id: '3',
          action: 'Updated system settings',
          target: 'Payment Gateway Config',
          admin: 'Admin User',
          timestamp: '2024-01-14T16:45:00Z',
          type: 'system'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'approval': return '✅';
      case 'user': return '👤';
      case 'system': return '⚙️';
      default: return '📝';
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'approval': return 'text-green-600';
      case 'user': return 'text-blue-600';
      case 'system': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Actions</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <div key={action.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`text-lg ${getActionColor(action.type)}`}>
              {getActionIcon(action.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{action.action}</p>
              <p className="text-sm text-gray-600 truncate">{action.target}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">by {action.admin}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {new Date(action.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {actions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No recent actions
        </div>
      )}
    </div>
  );
};

export default RecentActions;