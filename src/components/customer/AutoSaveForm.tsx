import React, { useState, useEffect, useCallback } from 'react';
import { Save, Clock } from 'lucide-react';

interface AutoSaveFormProps {
  formId: string;
  children: React.ReactNode;
  onSave?: (data: any) => Promise<boolean>;
  saveInterval?: number;
}

export const AutoSaveForm: React.FC<AutoSaveFormProps> = ({
  formId,
  children,
  onSave,
  saveInterval = 30000 // 30 seconds
}) => {
  const [formData, setFormData] = useState<any>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const storageKey = `autosave_${formId}`;

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFormData(parsedData.data);
        setLastSaved(new Date(parsedData.timestamp));
      } catch (error) {
        console.error('Failed to load autosaved data:', error);
      }
    }
  }, [storageKey]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (Object.keys(formData).length === 0) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      // Save to localStorage
      const saveData = {
        data: formData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(saveData));

      // Save to server if onSave provided
      if (onSave) {
        await onSave(formData);
      }

      setLastSaved(new Date());
      setSaveStatus('saved');
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave, storageKey]);

  // Set up auto-save interval
  useEffect(() => {
    const interval = setInterval(autoSave, saveInterval);
    return () => clearInterval(interval);
  }, [autoSave, saveInterval]);

  // Update form data when inputs change
  const updateFormData = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Clear saved data
  const clearSavedData = () => {
    localStorage.removeItem(storageKey);
    setFormData({});
    setLastSaved(null);
    setSaveStatus('idle');
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'saved':
        return <Save className="w-4 h-4 text-green-500" />;
      case 'error':
        return <Save className="w-4 h-4 text-red-500" />;
      default:
        return <Save className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved';
    }
  };

  return (
    <AutoSaveContext.Provider value={{ formData, updateFormData, clearSavedData }}>
      <div className="relative">
        {children}
        
        {/* Auto-save indicator */}
        <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-3 flex items-center space-x-2 text-sm">
          {getSaveStatusIcon()}
          <span className="text-gray-600">{getSaveStatusText()}</span>
        </div>
      </div>
    </AutoSaveContext.Provider>
  );
};

const AutoSaveContext = React.createContext<{
  formData: any;
  updateFormData: (field: string, value: any) => void;
  clearSavedData: () => void;
} | null>(null);

export const useAutoSave = () => {
  const context = React.useContext(AutoSaveContext);
  if (!context) {
    throw new Error('useAutoSave must be used within AutoSaveForm');
  }
  return context;
};

// Auto-save input component
export const AutoSaveInput: React.FC<{
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}> = ({ name, type = 'text', placeholder, className = '', defaultValue = '' }) => {
  const { formData, updateFormData } = useAutoSave();
  const [value, setValue] = useState(formData[name] || defaultValue);

  useEffect(() => {
    setValue(formData[name] || defaultValue);
  }, [formData, name, defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateFormData(name, newValue);
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

// Auto-save textarea component
export const AutoSaveTextarea: React.FC<{
  name: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  defaultValue?: string;
}> = ({ name, placeholder, className = '', rows = 3, defaultValue = '' }) => {
  const { formData, updateFormData } = useAutoSave();
  const [value, setValue] = useState(formData[name] || defaultValue);

  useEffect(() => {
    setValue(formData[name] || defaultValue);
  }, [formData, name, defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateFormData(name, newValue);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${className}`}
    />
  );
};