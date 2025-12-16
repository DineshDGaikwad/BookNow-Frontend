import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import Header from '../../components/common/Header';
import { adminAPI, PendingApproval } from '../../services/adminAPI';
import { venueAPI, VenueResponse } from '../../services/venueAPI';
import { toast } from 'react-toastify';

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [pendingVenues, setPendingVenues] = useState<VenueResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      const approvals = await adminAPI.getPendingApprovals();
      setPendingApprovals(approvals);
      
      // Get venue details for venue approvals
      const venues = await venueAPI.getApprovedVenues();
      const pending = venues.filter(v => v.venueStatus === 0); // 0 = Pending
      setPendingVenues(pending);
    } catch (error) {
      console.error('Failed to load approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVenue = async (venueId: string) => {
    try {
      await adminAPI.approveVenue(venueId);
      toast.success('Venue approved successfully!');
      loadPendingApprovals();
    } catch (error) {
      toast.error('Failed to approve venue');
    }
  };

  const handleRejectVenue = async (venueId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await adminAPI.rejectVenue(venueId, reason || undefined);
      toast.success('Venue rejected');
      loadPendingApprovals();
    } catch (error) {
      toast.error('Failed to reject venue');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}! ⚙️
          </h1>
          <p className="text-gray-600">Manage platform operations and approvals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">{pendingApprovals.length}</p>
              </div>
              <div className="text-3xl">⏳</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Venues</p>
                <p className="text-2xl font-bold text-blue-600">{pendingVenues.length}</p>
              </div>
              <div className="text-3xl">🏢</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/approvals" className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-6 hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105">
            <div className="text-2xl mb-3">📋</div>
            <h3 className="text-lg font-semibold mb-2">Review Approvals</h3>
            <p className="text-orange-100">Review pending organizer and venue approvals</p>
          </Link>

          <Link to="/admin/users" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-2xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-gray-600">View and manage user accounts</p>
          </Link>

          <Link to="/admin/settings" className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-2xl mb-3">⚙️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600">Configure platform settings</p>
          </Link>
        </div>

        {/* Pending Venue Approvals */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Venue Approvals</h2>
          {pendingVenues.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending venue approvals</p>
          ) : (
            <div className="space-y-4">
              {pendingVenues.map((venue) => (
                <div key={venue.venueId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{venue.venueName}</h3>
                      <p className="text-sm text-gray-600">{venue.venueAddress}</p>
                      <p className="text-sm text-gray-600">{venue.venueCity}, {venue.venueState}</p>
                      <p className="text-sm text-gray-500">Capacity: {venue.venueCapacity}</p>
                      <p className="text-xs text-gray-400">Submitted: {new Date(venue.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleApproveVenue(venue.venueId)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectVenue(venue.venueId)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;