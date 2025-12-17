import React, { useState, useEffect } from 'react';
import { adminAPI, AdminVenueResponse, UpdateVenueRequest } from '../../services/adminAPI';
import { toast } from 'react-toastify';

const VenueManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manage' | 'approvals'>('manage');
  const [venues, setVenues] = useState<AdminVenueResponse[]>([]);
  const [pendingVenues, setPendingVenues] = useState<AdminVenueResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingVenue, setEditingVenue] = useState<AdminVenueResponse | null>(null);
  const [editForm, setEditForm] = useState<UpdateVenueRequest>({
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueState: '',
    venueCapacity: 0,
    venueContactInfo: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'manage') {
        const venueData = await adminAPI.getAllVenues();
        setVenues(venueData);
      } else {
        const pendingData = await adminAPI.getPendingVenues();
        setPendingVenues(pendingData);
      }
    } catch (error) {
      toast.error('Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (venueId: string) => {
    try {
      await adminAPI.approveVenue(venueId);
      toast.success('Venue approved successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to approve venue');
    }
  };

  const handleReject = async (venueId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await adminAPI.rejectVenue(venueId, { rejectionReason: reason || undefined });
      toast.success('Venue rejected');
      loadData();
    } catch (error) {
      toast.error('Failed to reject venue');
    }
  };

  const handleEdit = (venue: AdminVenueResponse) => {
    setEditingVenue(venue);
    setEditForm({
      venueName: venue.venueName,
      venueAddress: venue.venueAddress,
      venueCity: venue.venueCity,
      venueState: venue.venueState,
      venueCapacity: venue.venueCapacity,
      venueContactInfo: ''
    });
  };

  const handleUpdate = async () => {
    if (!editingVenue) return;
    
    try {
      await adminAPI.updateVenue(editingVenue.venueId, editForm);
      toast.success('Venue updated successfully');
      setEditingVenue(null);
      loadData();
    } catch (error) {
      toast.error('Failed to update venue');
    }
  };

  const handleDelete = async (venueId: string) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;
    
    try {
      await adminAPI.deleteVenue(venueId);
      toast.success('Venue deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete venue');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold text-gray-900">Venue Management</h2>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'manage'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Manage Venues
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'approvals'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Approvals ({pendingVenues.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : activeTab === 'manage' ? (
          <div className="space-y-4">
            {venues.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No venues found</p>
            ) : (
              venues.map((venue) => (
                <div key={venue.venueId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{venue.venueName}</h3>
                      <p className="text-gray-600">{venue.venueAddress}, {venue.venueCity}, {venue.venueState}</p>
                      <p className="text-sm text-gray-500">Capacity: {venue.venueCapacity}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusBadge(venue.venueStatus)}`}>
                        {venue.venueStatus}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(venue)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(venue.venueId)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pendingVenues.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending venue requests</p>
            ) : (
              pendingVenues.map((venue) => (
                <div key={venue.venueId} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{venue.venueName}</h3>
                      <p className="text-gray-600">{venue.venueAddress}, {venue.venueCity}, {venue.venueState}</p>
                      <p className="text-sm text-gray-500">Capacity: {venue.venueCapacity}</p>
                      <p className="text-sm text-gray-500">Requested by: {venue.createdBy}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(venue.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(venue.venueId)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(venue.venueId)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Venue</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Venue Name"
                value={editForm.venueName}
                onChange={(e) => setEditForm({...editForm, venueName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Address"
                value={editForm.venueAddress}
                onChange={(e) => setEditForm({...editForm, venueAddress: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={editForm.venueCity}
                  onChange={(e) => setEditForm({...editForm, venueCity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={editForm.venueState}
                  onChange={(e) => setEditForm({...editForm, venueState: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <input
                type="number"
                placeholder="Capacity"
                value={editForm.venueCapacity}
                onChange={(e) => setEditForm({...editForm, venueCapacity: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Contact Info"
                value={editForm.venueContactInfo || ''}
                onChange={(e) => setEditForm({...editForm, venueContactInfo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setEditingVenue(null)}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueManagement;