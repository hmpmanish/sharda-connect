import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FiSave, FiFileText } from 'react-icons/fi';

const AdminContent = () => {
  const [page, setPage] = useState('homepage');
  const [content, setContent] = useState({ title: '', body: '', isActive: true });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/admin/content/${page}`);
        if (data) {
          setContent({ title: data.title, body: data.body, isActive: data.isActive });
        } else {
          setContent({ title: '', body: '', isActive: true });
        }
      } catch (error) {
        console.error('Failed to fetch content', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [page]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/admin/content/${page}`, content);
      alert('Content saved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save content. (SuperAdmin required)');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <FiFileText className="text-indigo-500" />
            <span>Content Management</span>
          </h1>
          <p className="text-slate-500 mt-1">Manage static pages dynamically without redeploying code.</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 pb-4">
        {['homepage', 'about', 'privacy', 'terms'].map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              page === p 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-slate-500 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          Loading content editor...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold capitalize">Editing: {page}</h2>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="isActive" 
                checked={content.isActive} 
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium">Page is Active</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Page Title</label>
            <input
              type="text"
              name="title"
              value={content.title}
              onChange={handleChange}
              placeholder="e.g., Privacy Policy"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Page Content (Supports HTML)</label>
            <textarea
              name="body"
              value={content.body}
              onChange={handleChange}
              placeholder="<h1>Your Content Here</h1>"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 min-h-[400px] font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 custom-scrollbar"
            ></textarea>
            <p className="text-xs text-slate-500 mt-2">You can use standard HTML tags to style the content.</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              <FiSave />
              <span>{saving ? 'Saving...' : 'Save Content'}</span>
            </button>
          </div>

        </form>
      )}
    </div>
  );
};

export default AdminContent;
