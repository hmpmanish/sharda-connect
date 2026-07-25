import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useCMSStore from '../../../store/cmsStore';

const AdminCMS = () => {
  const { data, fetchCMSData } = useCMSStore();
  const [activeTab, setActiveTab] = useState('WebsiteSettings');
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Define tabs and their corresponding keys in the CMS store
  const tabs = [
    { id: 'WebsiteSettings', label: 'Global Settings', endpoint: '/api/cms/settings' },
    { id: 'HomepageContent', label: 'Homepage Hero & CTA', endpoint: '/api/cms/homepage' },
    { id: 'Navigation', label: 'Navigation Menu', endpoint: '/api/cms/navigation', isArray: true },
    { id: 'Features', label: 'Features', endpoint: '/api/cms/features', isArray: true },
    { id: 'WhyChooseUs', label: 'Why Choose Us', endpoint: '/api/cms/why-choose-us', isArray: true },
    { id: 'Community', label: 'Communities', endpoint: '/api/cms/community', isArray: true },
    { id: 'Testimonials', label: 'Testimonials', endpoint: '/api/cms/testimonials', isArray: true },
    { id: 'FAQ', label: 'FAQs', endpoint: '/api/cms/faqs', isArray: true },
    { id: 'Footer', label: 'Footer Settings', endpoint: '/api/cms/footer' },
    { id: 'SocialLinks', label: 'Social Links', endpoint: '/api/cms/social-links', isArray: true },
    { id: 'SEO', label: 'SEO Config', endpoint: '/api/cms/seo' },
    { id: 'Theme', label: 'Theme Colors', endpoint: '/api/cms/theme' }
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  useEffect(() => {
    // When tab changes, load data from global store into local state for editing
    const rawData = data[activeTab.charAt(0).toLowerCase() + activeTab.slice(1)] || data[activeTab] || (currentTab.isArray ? [] : {});
    setFormData(JSON.parse(JSON.stringify(rawData)));
  }, [activeTab, data, currentTab.isArray]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = currentTab.isArray ? { items: formData } : formData;
      await axios.put(currentTab.endpoint, payload, { withCredentials: true });
      toast.success(`${currentTab.label} updated successfully`);
      await fetchCMSData(); // Refresh global store
    } catch (error) {
      toast.error('Failed to update CMS data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, field, value) => {
    const newData = [...formData];
    newData[index] = { ...newData[index], [field]: value };
    setFormData(newData);
  };

  const addArrayItem = () => {
    setFormData([...formData, {}]);
  };

  const removeArrayItem = (index) => {
    const newData = formData.filter((_, i) => i !== index);
    setFormData(newData);
  };

  // Generic renderer for flat objects
  const renderObjectFields = () => {
    if (!formData || typeof formData !== 'object' || Array.isArray(formData)) return null;
    return Object.keys(formData).map((key) => {
      if (key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') return null;
      if (typeof formData[key] === 'object' && formData[key] !== null) {
         return (
           <div key={key} className="mb-4 p-4 border border-slate-700 rounded-lg">
             <h4 className="font-bold mb-2 capitalize">{key}</h4>
             <textarea 
               value={JSON.stringify(formData[key], null, 2)}
               onChange={(e) => {
                 try {
                   const parsed = JSON.parse(e.target.value);
                   setFormData({...formData, [key]: parsed});
                 } catch (err) {} // ignore invalid json while typing
               }}
               className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white h-32"
             />
           </div>
         );
      }
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
          {key.toLowerCase().includes('description') || key.toLowerCase().includes('text') ? (
            <textarea
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-indigo-500 h-24"
            />
          ) : (
            <input
              type="text"
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>
      );
    });
  };

  const renderArrayFields = () => {
    if (!Array.isArray(formData)) return null;
    return (
      <div>
        {formData.map((item, index) => (
          <div key={index} className="mb-6 p-4 border border-slate-700 rounded-xl bg-slate-800 relative">
            <button 
              onClick={() => removeArrayItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-400"
            >
              Remove
            </button>
            <h4 className="font-bold mb-4 text-indigo-400">Item #{index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(item).map((key) => {
                if (key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') return null;
                return (
                  <div key={key}>
                    <label className="block text-xs text-slate-400 mb-1 capitalize">{key}</label>
                    <input
                      type="text"
                      value={item[key] || ''}
                      onChange={(e) => handleArrayChange(index, key, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <button 
          onClick={addArrayItem}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          + Add New Item
        </button>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 min-h-full rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-800">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-slate-800 border-r border-slate-700 p-4 shrink-0 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6 px-2">CMS Manager</h2>
        <nav className="space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-900 text-white">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-2xl font-bold text-white">{currentTab.label}</h3>
            <p className="text-slate-400 text-sm mt-1">Manage content for this section across the website.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="max-w-4xl">
          {currentTab.isArray ? renderArrayFields() : renderObjectFields()}
          
          {!currentTab.isArray && Object.keys(formData).length === 0 && (
            <div className="text-slate-500 italic">No data found. Add fields by initializing defaults in backend, or enter JSON payload here if supported.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
