import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FiSearch, FiUserPlus, FiCheck, FiX, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const FindStudents = () => {
  const [keyword, setKeyword] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState([]); // To track existing connections

  const fetchConnections = async () => {
    try {
      const { data } = await axios.get('/connections');
      setConnections(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const searchStudents = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`/connections/search?keyword=${keyword}`);
      setStudents(data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (userId) => {
    try {
      await axios.post(`/connections/request/${userId}`);
      toast.success('Connection request sent!');
      fetchConnections(); // Refresh connection status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const getConnectionStatus = (userId) => {
    const conn = connections.find(
      c => c.requester._id === userId || c.recipient._id === userId
    );
    if (!conn) return null;
    return conn.status;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50">
        <h2 className="text-2xl font-bold mb-2">Find Students</h2>
        <p className="text-slate-500 mb-6">Search by name, course, or branch to connect.</p>

        <form onSubmit={searchStudents} className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search for friends..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-rose-500 transition-colors"
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((student) => {
          const status = getConnectionStatus(student._id);
          
          return (
            <div key={student._id} className="glass-panel p-4 rounded-xl flex items-center space-x-4 bg-white/40 dark:bg-slate-900/40">
              <img 
                src={student.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=random`} 
                alt={student.fullName} 
                className="w-16 h-16 rounded-full object-cover border-2 border-rose-100"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{student.fullName}</h3>
                <p className="text-sm text-slate-500">{student.course} • {student.branch}</p>
              </div>
              <div>
                {!status ? (
                  <button 
                    onClick={() => sendRequest(student._id)}
                    className="p-2 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
                    title="Send Request"
                  >
                    <FiUserPlus className="w-5 h-5" />
                  </button>
                ) : status === 'pending' ? (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200">Pending</span>
                ) : status === 'accepted' ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200 flex items-center gap-1">
                    <FiCheck /> Connected
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1">
                    <FiShield /> Blocked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {students.length === 0 && !loading && keyword && (
        <div className="text-center text-slate-500 py-12">
          No students found matching "{keyword}"
        </div>
      )}
    </div>
  );
};

export default FindStudents;
