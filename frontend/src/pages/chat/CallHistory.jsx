import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { FiPhone, FiPhoneMissed, FiVideo, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

const CallHistory = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/calls/history');
      setCalls(res.data);
    } catch (error) {
      console.error('Failed to fetch call history', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCall = async (id) => {
    try {
      await axios.delete(`/calls/${id}`);
      setCalls(calls.filter(c => c._id !== id));
    } catch (error) {
      console.error('Failed to delete call record', error);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (loading) return <div className="p-4 text-center">Loading call history...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold">Call History</h2>
      </div>
      
      {calls.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No recent calls found.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {calls.map((call) => (
            <li key={call._id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {call.type === 'video' ? <FiVideo className="text-gray-600 dark:text-gray-300" /> : <FiPhone className="text-gray-600 dark:text-gray-300" />}
                </div>
                <div>
                  <h4 className="font-semibold">
                    {call.caller?.fullName || 'Unknown'} → {call.receiver?.fullName || 'Unknown'}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {call.status === 'missed' ? (
                      <span className="flex items-center text-red-500"><FiPhoneMissed className="mr-1" /> Missed</span>
                    ) : (
                      <span className="capitalize">{call.status}</span>
                    )}
                    <span>•</span>
                    <span>{format(new Date(call.createdAt), 'MMM d, h:mm a')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-sm text-gray-500">
                  {formatDuration(call.duration)}
                </div>
                <button onClick={() => deleteCall(call._id)} className="text-gray-400 hover:text-red-500 transition">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CallHistory;
