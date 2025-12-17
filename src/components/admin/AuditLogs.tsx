import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'react-toastify';

interface AuditLog {
  auditId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    entityType: '',
    userId: '',
    page: 1,
    pageSize: 50
  });

  useEffect(() => {
    loadAuditLogs();
  }, [filters]);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getAuditLogs(filters);
      setLogs(data);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const colors = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'DELETE': 'bg-red-100 text-red-800',
      'LOGIN': 'bg-purple-100 text-purple-800',
      'LOGOUT': 'bg-gray-100 text-gray-800',
      'APPROVE': 'bg-emerald-100 text-emerald-800',
      'REJECT': 'bg-orange-100 text-orange-800'
    };
    return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      'Admin': 'bg-red-100 text-red-800',
      'Organizer': 'bg-blue-100 text-blue-800',
      'Customer': 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
        <p className="text-sm text-gray-600 mt-1">Track all system activities and user actions</p>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.entityType}
            onChange={(e) => setFilters({...filters, entityType: e.target.value, page: 1})}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Entity Types</option>
            <option value="User">User</option>
            <option value="Event">Event</option>
            <option value="Venue">Venue</option>
            <option value="Booking">Booking</option>
            <option value="Show">Show</option>
          </select>
          
          <input
            type="text"
            placeholder="Filter by User ID"
            value={filters.userId}
            onChange={(e) => setFilters({...filters, userId: e.target.value, page: 1})}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          
          <select
            value={filters.pageSize}
            onChange={(e) => setFilters({...filters, pageSize: parseInt(e.target.value), page: 1})}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No audit logs found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.auditId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                      <div className="text-sm text-gray-500">{log.userId}</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(log.userRole)}`}>
                        {log.userRole}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getActionBadge(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.entityType}</div>
                    {log.entityId && (
                      <div className="text-sm text-gray-500">{log.entityId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {log.details || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Page {filters.page} • {logs.length} records
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilters({...filters, page: Math.max(1, filters.page - 1)})}
            disabled={filters.page === 1}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setFilters({...filters, page: filters.page + 1})}
            disabled={logs.length < filters.pageSize}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;