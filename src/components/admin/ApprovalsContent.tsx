import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ApprovalRequest } from '../../types/admin.types';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const ApprovalsContent: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const data = await adminService.getPendingApprovals();
      setApprovals(data);
    } catch (error) {
      toast.error('Failed to fetch approvals');
      // Mock data for development
      setApprovals([
        {
          id: '1',
          approvalType: 'Organizer',
          targetEntityId: 'ORG001',
          status: 'Pending',
          payloadSnapshot: '{}',
          requestedByUserId: 'USER001',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          approvalType: 'Venue',
          targetEntityId: 'VEN001',
          status: 'Pending',
          payloadSnapshot: '{}',
          requestedByUserId: 'USER002',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approvalId: string) => {
    if (!user?.userId) return;
    
    try {
      await adminService.approveRequest(approvalId, {
        adminId: user.userId,
        remarks: 'Approved by admin'
      });
      toast.success('Request approved successfully');
      fetchApprovals();
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (approvalId: string) => {
    if (!user?.userId) return;
    
    const remarks = prompt('Please provide rejection reason:');
    if (!remarks) return;
    
    try {
      await adminService.rejectRequest(approvalId, {
        adminId: user.userId,
        remarks
      });
      toast.success('Request rejected successfully');
      fetchApprovals();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Pending Approvals</h2>
        <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
          {approvals.length} pending
        </span>
      </div>
      
      {approvals.map((approval) => (
        <div key={approval.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {approval.approvalType}
                </span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {approval.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {approval.approvalType} Approval Request
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Requested by:</strong> {approval.requestedByUserId}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Target Entity:</strong> {approval.targetEntityId}
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(approval.createdAt).toLocaleString()}
              </p>
              {approval.remarks && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Remarks:</strong> {approval.remarks}
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleApprove(approval.id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(approval.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {approvals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
          <p className="text-gray-500">All approval requests have been processed.</p>
        </div>
      )}
    </div>
  );
};

export default ApprovalsContent;