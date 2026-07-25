import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FiSave, FiSettings } from 'react-icons/fi';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    websiteName: '',
    maintenanceMode: false,
    registrationEnabled: true,
    anonymousMessagingEnabled: true,
    maxMessageLength: 2000,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/admin/settings');
        if (data) setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/admin/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save settings. (SuperAdmin required)');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <FiSettings className="text-indigo-500" />
            <span>Global Settings</span>
          </h1>
          <p className="text-slate-500 mt-1">Configure site-wide parameters. (Requires SuperAdmin)</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* General Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2">General</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Website Name</label>
              <input
                type="text"
                name="websiteName"
                value={settings.websiteName || ''}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Message Length (Characters)</label>
              <input
                type="number"
                name="maxMessageLength"
                value={settings.maxMessageLength || 2000}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold border-b border-slate-200 dark:border-slate-700 pb-2">Feature Toggles</h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">Maintenance Mode</p>
                <p className="text-sm text-slate-500">Temporarily block all users from accessing the site.</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-indigo-500 transition-all duration-200" />
                <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer ${settings.maintenanceMode ? 'bg-indigo-500' : ''}`}></label>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">Allow New Registrations</p>
                <p className="text-sm text-slate-500">Allow new users to sign up for accounts.</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="registrationEnabled" checked={settings.registrationEnabled} onChange={handleChange} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-green-500 transition-all duration-200" />
                <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer ${settings.registrationEnabled ? 'bg-green-500' : ''}`}></label>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">Enable Anonymous Messaging</p>
                <p className="text-sm text-slate-500">Allow users to send and receive anonymous messages.</p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="anonymousMessagingEnabled" checked={settings.anonymousMessagingEnabled} onChange={handleChange} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300 checked:right-0 checked:border-green-500 transition-all duration-200" />
                <label className={`toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer ${settings.anonymousMessagingEnabled ? 'bg-green-500' : ''}`}></label>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <FiSave />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
      
      {/* Required inline styles for the custom toggle switches because Tailwind forms plugin isn't active by default here */}
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked { right: 0; border-color: transparent; }
        .toggle-checkbox:checked + .toggle-label { background-color: #6366f1; }
      `}} />
    </div>
  );
};

export default AdminSettings;
