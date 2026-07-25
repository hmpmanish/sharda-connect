import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FiShield, FiClock, FiGlobe, FiMonitor } from 'react-icons/fi';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get('/admin/audit-logs');
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch audit logs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionColor = (actionType) => {
    if (actionType.includes('DELETE') || actionType.includes('BANNED')) return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    if (actionType.includes('LOGIN')) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    if (actionType.includes('UPDATE') || actionType.includes('EDIT')) return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    return 'text-slate-500 bg-slate-50 dark:bg-slate-900/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <FiShield className="text-indigo-500" />
            <span>Audit Logs</span>
          </h1>
          <p className="text-slate-500 mt-1">Track every action performed by administrators.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Admin</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Details</th>
                <th className="p-4 font-medium">System Info</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">Loading audit logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No logs found.</td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log._id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <FiClock className="text-slate-400" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-sm">{log.adminId?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500 capitalize">{log.adminId?.role || 'admin'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wider ${getActionColor(log.actionType)}`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                      {log.details || `Performed action on ${log.targetModel}`}
                    </td>
                    <td className="p-4">
                      <div className="text-xs text-slate-500 space-y-1">
                        <div className="flex items-center space-x-1">
                          <FiGlobe /> <span>{log.ipAddress || 'Unknown IP'}</span>
                        </div>
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

export default AdminAuditLogs;
