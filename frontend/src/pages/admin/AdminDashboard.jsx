import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiUsers, FiMessageSquare, FiAlertCircle, FiUserX, FiShieldOff, FiArchive } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/admin/dashboard/metrics');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading metrics...</div>;
  }

  const statCards = [
    { title: 'Total Users', value: data?.metrics.totalUsers || 0, icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Active Users', value: data?.metrics.activeUsers || 0, icon: FiUsers, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Suspended Users', value: data?.metrics.suspendedUsers || 0, icon: FiUserX, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Banned Users', value: data?.metrics.bannedUsers || 0, icon: FiShieldOff, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Total Messages', value: data?.metrics.totalMessages || 0, icon: FiMessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { title: 'Archived Messages', value: data?.metrics.archivedMessages || 0, icon: FiArchive, color: 'text-slate-500', bg: 'bg-slate-500/10' },
    { title: 'Total Reports', value: data?.metrics.totalReports || 0, icon: FiAlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: 'Pending Reports', value: data?.metrics.pendingReports || 0, icon: FiAlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={idx} 
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center space-x-4 shadow-sm"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-8">
        <h3 className="text-lg font-bold mb-6">User Registrations (Last 7 Days)</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.charts?.registrations || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} 
              />
              <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
