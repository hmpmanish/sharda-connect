import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FiCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [notes, setNotes] = useState('');

  const fetchReports = async () => {
    try {
      const { data } = await axios.get('/admin/reports');
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await axios.put(`/admin/reports/${id}`, { status, adminNotes: notes });
      setSelectedReport(null);
      setNotes('');
      fetchReports();
    } catch (error) {
      alert('Failed to update report');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Report Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reports List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold">Abuse Reports</h2>
          </div>
          <div className="overflow-y-auto max-h-[600px] divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No reports found. You're all clear!</div>
            ) : (
              reports.map(report => (
                <div 
                  key={report._id} 
                  onClick={() => { setSelectedReport(report); setNotes(report.adminNotes || ''); }}
                  className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedReport?._id === report._id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center space-x-1 text-sm font-semibold text-red-500">
                      <FiAlertTriangle className="w-4 h-4" />
                      <span>{report.reason}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      report.status === 'rejected' ? 'bg-slate-100 text-slate-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {report.reportedMessage 
                      ? `Anon Message: "${report.reportedMessage.content}"` 
                      : report.targetDirectMessage 
                        ? `Direct Message: "${report.targetDirectMessage.content}"`
                        : '[Deleted Message]'}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Reported by {report.reportedBy?.fullName || 'Unknown'} • {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Report Action Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="font-semibold mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Action Panel</h2>
          
          {selectedReport ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Reason</p>
                <p className="font-semibold text-red-500">{selectedReport.reason}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  {selectedReport.description || 'No description provided by user.'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Reported Message</p>
                <div className="text-sm bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                  {selectedReport.reportedMessage ? (
                    <div>
                      <span className="font-bold mr-2">Anon Message:</span>
                      {selectedReport.reportedMessage.content}
                    </div>
                  ) : selectedReport.targetDirectMessage ? (
                    <div>
                      <span className="font-bold mr-2">Direct Message:</span>
                      {selectedReport.targetDirectMessage.content}
                    </div>
                  ) : (
                    'Message has been deleted.'
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Admin Notes</p>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add resolution notes here..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => handleUpdate(selectedReport._id, 'resolved')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm shadow-green-500/20"
                >
                  <FiCheck /> <span>Resolve</span>
                </button>
                <button 
                  onClick={() => handleUpdate(selectedReport._id, 'rejected')}
                  className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <FiX /> <span>Reject</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm text-center">
              Select a report from the list to view details and take action.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminReports;
