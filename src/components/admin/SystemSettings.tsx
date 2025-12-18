import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { SystemSetting } from '../../types/admin.types';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const SystemSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllSettings();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (setting: SystemSetting) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  const handleSave = async (key: string) => {
    if (!user?.userId) return;

    try {
      await adminService.updateSetting(key, editValue, user.userId);
      toast.success('Setting updated successfully');
      setEditingKey(null);
      loadSettings();
    } catch (error) {
      toast.error('Failed to update setting');
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Security': 'bg-red-100 text-red-800',
      'Payment': 'bg-green-100 text-green-800',
      'Email': 'bg-purple-100 text-purple-800',
      'Notification': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    const category = setting.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(setting);
    return acc;
  }, {} as Record<string, SystemSetting[]>);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Configure system-wide settings and parameters</p>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">Loading settings...</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSettings).map(([category, categorySettings]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                </h3>
                
                <div className="grid gap-4">
                  {categorySettings.map((setting) => (
                    <div key={setting.key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{setting.key}</h4>
                            {!setting.isEditable && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                Read Only
                              </span>
                            )}
                          </div>
                          
                          {setting.description && (
                            <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Value:</span>
                            {editingKey === setting.key ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                                />
                                <button
                                  onClick={() => handleSave(setting.key)}
                                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 flex-1">
                                <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                                  {setting.value}
                                </code>
                                {setting.isEditable && (
                                  <button
                                    onClick={() => handleEdit(setting)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500">
                            Created: {new Date(setting.createdAt).toLocaleString()}
                            {setting.updatedAt && (
                              <span className="ml-4">
                                Updated: {new Date(setting.updatedAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {settings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">⚙️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No system settings found</h3>
                <p className="text-gray-500">System settings will appear here when configured.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;