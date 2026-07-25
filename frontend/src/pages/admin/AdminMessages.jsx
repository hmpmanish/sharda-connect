import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FiSearch, FiArchive, FiTrash2, FiMessageSquare } from 'react-icons/fi';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMessages = async (keyword = '') => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/admin/messages?keyword=${keyword}`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchMessages(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleArchive = async (id, currentStatus) => {
    try {
      await axios.put(`/admin/messages/${id}/archive`, { isArchived: !currentStatus });
      fetchMessages(search);
    } catch (error) {
      alert('Failed to archive message');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message permanently? This action cannot be undone.')) {
      try {
        await axios.delete(`/admin/messages/${id}`);
        fetchMessages(search);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete message');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Message Management</h1>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div className="relative max-w-md w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search message content..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium w-1/2">Content</th>
                <th className="p-4 font-medium">Recipient</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Loading messages...</td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No messages found.</td>
                </tr>
              ) : (
                messages.map(msg => (
                  <tr key={msg._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-start space-x-3">
                        <FiMessageSquare className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
                        <p className="text-sm font-medium line-clamp-2">{msg.content}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {msg.recipient ? msg.recipient.fullName : 'Deleted User'}
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {msg.isArchived ? (
                        <span className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Archived
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => toggleArchive(msg._id, msg.isArchived)} 
                          title={msg.isArchived ? "Restore" : "Archive"} 
                          className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        >
                          <FiArchive />
                        </button>
                        <button 
                          onClick={() => handleDelete(msg._id)} 
                          title="Delete Permanently" 
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
