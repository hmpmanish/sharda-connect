import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiClock, FiSend } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalReceived: 0,
    unread: 0,
    favorites: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/messages/inbox');
        setStats({
          totalReceived: data.length,
          unread: data.filter(m => !m.isRead).length,
          favorites: data.filter(m => m.isFavorite).length,
        });
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Confessions Received', value: stats.totalReceived, icon: FiHeart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { title: 'Unread Messages', value: stats.unread, icon: FiClock, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { title: 'Favorite Letters', value: stats.favorites, icon: FiStar, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-light-muted dark:text-dark-muted">Here's what's happening in your secret inbox.</p>
        </div>
        
        {/* Share Link Button */}
        <button 
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/send/${user?._id}`);
            alert('Your secret confession link has been copied to clipboard!');
          }}
          className="btn-primary flex items-center space-x-2 shadow-rose-500/40"
        >
          <FiSend />
          <span>Copy My Secret Link</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 flex items-center space-x-4 hover:shadow-rose-500/10 transition-shadow"
          >
            <div className={`p-4 rounded-full ${card.bg} ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-light-muted dark:text-dark-muted">{card.title}</p>
              <h3 className="text-2xl font-bold">{loading ? '-' : card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6 min-h-[300px] flex items-center justify-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl"></div>

        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
            <FiHeart className="w-10 h-10 text-rose-500 fill-rose-500/20" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ready for some love?</h3>
          <p className="text-light-muted dark:text-dark-muted max-w-md mx-auto">
            Share your secret link on Instagram stories or WhatsApp to start receiving anonymous confessions and letters from your friends and secret admirers!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
