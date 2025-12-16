import React, { useEffect, useState } from 'react';

interface ApprovalRequest {
  id: string;
  type: string;
  requestedBy: string;
  createdAt: string;
  status: string;
}

const PendingApprovals: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API
    // Mock data for now
    setTimeout(() => {
      setApprovals([
        {
          id: '1',
          type: 'Organizer Registration',
          requestedBy: 'John Events Co.',
          createdAt: '2024-01-15',
          status: 'Pending'
        },
        {
          id: '2',
          type: 'Venue Approval',
          requestedBy: 'City Convention Center',
          createdAt: '2024-01-14',
          status: 'Pending'
        },
        {
          id: '3',
          type: 'Event Approval',
          requestedBy: 'Music Festival 2024',
          createdAt: '2024-01-13',
          status: 'Pending'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (id: string) => {
    // TODO: API call to approve
    console.log('Approving:', id);
  };

  const handleReject = (id: string) => {
    // TODO: API call to reject
    console.log('Rejecting:', id);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {approvals.length} pending
        </span>
      </div>
      
      <div className="space-y-3">
        {approvals.map((approval) => (
          <div key={approval.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{approval.type}</p>
              <p className="text-sm text-gray-600">{approval.requestedBy}</p>
              <p className="text-xs text-gray-500">{new Date(approval.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleApprove(approval.id)}
                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(approval.id)}
                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {approvals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No pending approvals
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;