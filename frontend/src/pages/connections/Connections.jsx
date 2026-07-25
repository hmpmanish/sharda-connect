import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import useAuthStore from '../../store/authStore';
import { FiCheck, FiX, FiShield, FiMessageCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const { data } = await axios.get('/connections');
      setConnections(data);
    } catch (error) {
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/connections/${id}`, { status });
      toast.success(`Connection ${status}`);
      fetchConnections();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const startChat = async (targetUserId) => {
    try {
      await axios.post('/conversations', { targetUserId });
      navigate('/chat');
    } catch (error) {
      toast.error('Could not start chat');
    }
  };

  const renderConnectionCard = (conn, type) => {
    const otherUser = conn.requester._id === user._id ? conn.recipient : conn.requester;
    const isReceivedRequest = conn.recipient._id === user._id && conn.status === 'pending';

    return (
      <div key={conn._id} className="glass-panel p-4 rounded-xl flex items-center space-x-4 bg-white/40 dark:bg-slate-900/40 border border-white/50">
        <img 
          src={otherUser.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.fullName)}&background=random`} 
          alt={otherUser.fullName} 
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{otherUser.fullName}</h3>
          <p className="text-xs text-slate-500">{otherUser.course}</p>
        </div>
        <div className="flex gap-2">
          {isReceivedRequest && (
            <>
              <button onClick={() => handleUpdateStatus(conn._id, 'accepted')} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"><FiCheck /></button>
              <button onClick={() => handleUpdateStatus(conn._id, 'rejected')} className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200"><FiX /></button>
            </>
          )}
          {conn.status === 'accepted' && (
            <>
              <button onClick={() => startChat(otherUser._id)} className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200"><FiMessageCircle /></button>
              <button onClick={() => handleUpdateStatus(conn._id, 'blocked')} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200" title="Block"><FiShield /></button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center">Loading connections...</div>;

  const pendingRequests = connections.filter(c => c.status === 'pending' && c.recipient._id === user._id);
  const activeConnections = connections.filter(c => c.status === 'accepted');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {pendingRequests.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-rose-100 text-rose-600 w-6 h-6 rounded-full inline-flex items-center justify-center text-sm">{pendingRequests.length}</span>
            Pending Requests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map(c => renderConnectionCard(c, 'pending'))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">My Connections</h2>
        {activeConnections.length === 0 ? (
          <div className="text-center py-12 bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">You don't have any connections yet.</p>
            <button onClick={() => navigate('/find-students')} className="mt-4 text-rose-500 font-medium hover:underline">Find Students</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeConnections.map(c => renderConnectionCard(c, 'accepted'))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Connections;
