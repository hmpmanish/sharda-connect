import User from '../models/User.js';
import Message from '../models/Message.js';
import Report from '../models/Report.js';

// @desc    Get dashboard metrics for Recharts
// @route   GET /api/admin/dashboard/metrics
// @access  Private (Admin)
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });
    const bannedUsers = await User.countDocuments({ status: 'banned' });
    
    const totalMessages = await Message.countDocuments();
    const archivedMessages = await Message.countDocuments({ isArchived: true });
    
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    // Aggregate users registered by day for last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      return d;
    }).reverse();

    const registrationsChart = [];
    for (let i = 0; i < last7Days.length; i++) {
      const start = last7Days[i];
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const count = await User.countDocuments({
        createdAt: { $gte: start, $lt: end }
      });

      registrationsChart.push({
        date: start.toLocaleDateString('en-US', { weekday: 'short' }),
        users: count
      });
    }

    res.status(200).json({
      metrics: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        bannedUsers,
        totalMessages,
        archivedMessages,
        totalReports,
        pendingReports
      },
      charts: {
        registrations: registrationsChart
      }
    });
  } catch (error) {
    next(error);
  }
};
