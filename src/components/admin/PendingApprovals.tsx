import React, { useState, useEffect } from 'react';
import { ApprovalRequest } from '../../types/admin.types';
import adminService from '../../services/adminService';

const PendingApprovals: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      const data = await adminService.getPendingApprovals();
      setApprovals(data.slice(0, 5)); // Show only first 5 for dashboard
    } catch (error) {
      console.error('Failed to load pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getApprovalTypeColor = (type: string) => {
    switch (type) {
      case 'Venue': return 'bg-blue-100 text-blue-800';
      case 'Event': return 'bg-green-100 text-green-800';
      case 'Organizer': return 'bg-purple-100 text-purple-800';
      case 'Show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalIcon = (type: string) => {
    switch (type) {
      case 'Venue': return '🏢';
      case 'Event': return '🎭';
      case 'Organizer': return '👤';
      case 'Show': return '🎪';
      default: return '📋';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const approvalDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - approvalDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            <p className="text-sm text-gray-600 mt-1">Items requiring your attention</p>
          </div>
          {approvals.length > 0 && (
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {approvals.length} pending
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : approvals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">✅</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h4>
            <p className="text-gray-500">No pending approvals at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div key={approval.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-lg">
                  {getApprovalIcon(approval.approvalType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getApprovalTypeColor(approval.approvalType)}`}>
                      {approval.approvalType}
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      {approval.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {approval.approvalType} Approval Request
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Entity: {approval.targetEntityId}
                  </p>
                  <p className="text-xs text-gray-500">
                    Requested {getTimeAgo(approval.createdAt)} by {approval.requestedByUserId}
                  </p>
                </div>
              </div>
            ))}
            
            {approvals.length >= 5 && (
              <div className="text-center pt-4 border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all approvals →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;