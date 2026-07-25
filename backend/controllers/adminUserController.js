import User from '../models/User.js';
import Message from '../models/Message.js';
import Report from '../models/Report.js';
import AuditLog from '../models/AuditLog.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users (with search and pagination)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { fullName: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find({ ...keyword }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (suspend, ban, active)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      user.status = status;
      await user.save();
      
      await AuditLog.create({
        adminId: req.admin._id,
        actionType: `USER_${status.toUpperCase()}`,
        targetModel: 'User',
        targetId: user._id,
        ipAddress: req.ip,
        details: `Admin changed user status to ${status}`
      });

      res.status(200).json({ message: `User status updated to ${status}`, user });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/reset-password
// @access  Private (SuperAdmin)
export const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
      user.password = newPassword; // Pre-save hook will hash it
      await user.save();
      
      await AuditLog.create({
        adminId: req.admin._id,
        actionType: 'USER_PASSWORD_RESET',
        targetModel: 'User',
        targetId: user._id,
        ipAddress: req.ip,
        details: `SuperAdmin reset user password`
      });

      res.status(200).json({ message: 'User password reset successfully' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user completely
// @route   DELETE /api/admin/users/:id
// @access  Private (SuperAdmin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      // Delete user
      await User.deleteOne({ _id: user._id });
      // Delete associated messages
      await Message.deleteMany({ recipient: user._id });
      // Delete associated reports
      await Report.deleteMany({ reportedBy: user._id });

      await AuditLog.create({
        adminId: req.admin._id,
        actionType: 'USER_DELETED',
        targetModel: 'User',
        targetId: user._id,
        ipAddress: req.ip,
        details: `SuperAdmin deleted user ${user.email}`
      });

      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
