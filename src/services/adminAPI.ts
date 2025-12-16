import api from './api';

export interface PendingApproval {
  id: string;
  approvalType: number;
  targetEntityId: string;
  requestedByUserId: string;
  status: number;
  payloadSnapshot: string;
  createdAt: string;
  updatedAt?: string;
}

export interface VenueApproval {
  venueId: string;
  venueName: string;
  organizerId: string;
  organizerName: string;
  venueAddress?: string;
  venueCity?: string;
  venueCapacity: number;
  createdAt: string;
}

export const adminAPI = {
  getPendingApprovals: async (): Promise<PendingApproval[]> => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:5089/api/admin/approvals/pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  approveVenue: async (venueId: string): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:5089/api/admin/venues/${venueId}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  },

  rejectVenue: async (venueId: string, reason?: string): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:5089/api/admin/venues/${venueId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  }
};