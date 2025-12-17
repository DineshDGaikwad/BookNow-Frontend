import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'approvals', label: 'Pending Approvals', icon: '✅' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'venues', label: 'Venue Management', icon: '🏢' },
    { id: 'eventoverview', label: 'Event Overview', icon: '🎭' },
    { id: 'audit', label: 'Audit Logs', icon: '📋' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">BookNow Admin</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
              activeTab === item.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : 'text-gray-700'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;