import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FiSearch, FiDownload, FiEdit2, FiTrash2, FiShieldOff, FiCheckCircle } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async (keyword = '') => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/admin/users?keyword=${keyword}`);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounced search
    const timer = setTimeout(() => fetchUsers(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (window.confirm(`Are you sure you want to change user status to ${newStatus}?`)) {
      try {
        await axios.put(`/admin/users/${id}/status`, { status: newStatus });
        fetchUsers(search); // Refresh list
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to update status');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: This will permanently delete the user and all their messages. Continue?')) {
      try {
        await axios.delete(`/admin/users/${id}`);
        fetchUsers(search);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user. You may need SuperAdmin rights.');
      }
    }
  };

  const downloadCSV = () => {
    if (!users.length) return;

    // Headers
    const headers = ['ID', 'Full Name', 'Email', 'Course', 'Branch', 'Year', 'Semester', 'Status', 'Joined Date'];
    
    // Rows
    const rows = users.map(u => [
      u._id, 
      `"${u.fullName}"`, 
      u.email, 
      u.course, 
      u.branch, 
      u.year, 
      u.semester, 
      u.status,
      new Date(u.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'users_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button 
          onClick={downloadCSV}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <FiDownload />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Details</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img src={user.profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p>{user.course} {user.branch && `- ${user.branch}`}</p>
                        <p className="text-xs text-slate-500">Year {user.year} (Sem {user.semester})</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        user.status === 'suspended' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end space-x-2">
                        {user.status === 'active' ? (
                          <button onClick={() => handleStatusChange(user._id, user.status, 'suspended')} title="Suspend User" className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
                            <FiShieldOff />
                          </button>
                        ) : (
                          <button onClick={() => handleStatusChange(user._id, user.status, 'active')} title="Activate User" className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                            <FiCheckCircle />
                          </button>
                        )}
                        
                        <button onClick={() => handleStatusChange(user._id, user.status, 'banned')} title="Ban User" className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <FiShieldOff className="fill-red-500/20" />
                        </button>

                        <button onClick={() => handleDelete(user._id)} title="Delete Permanently" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
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

export default AdminUsers;
