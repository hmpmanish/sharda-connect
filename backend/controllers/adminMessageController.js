import Message from '../models/Message.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all messages (with search/filter)
// @route   GET /api/admin/messages
// @access  Private (Admin)
export const getAllMessages = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? { content: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const messages = await Message.find({ ...keyword })
      .populate('recipient', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Archive or Restore message
// @route   PUT /api/admin/messages/:id/archive
// @access  Private (Admin)
export const toggleArchiveMessage = async (req, res, next) => {
  try {
    const { isArchived } = req.body;
    const message = await Message.findById(req.params.id);

    if (message) {
      message.isArchived = isArchived;
      await message.save();

      await AuditLog.create({
        adminId: req.admin._id,
        actionType: isArchived ? 'MESSAGE_ARCHIVED' : 'MESSAGE_RESTORED',
        targetModel: 'Message',
        targetId: message._id,
        ipAddress: req.ip,
        details: `Admin ${isArchived ? 'archived' : 'restored'} message`
      });

      res.status(200).json({ message: 'Message archive status updated' });
    } else {
      res.status(404);
      throw new Error('Message not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message permanently
// @route   DELETE /api/admin/messages/:id
// @access  Private (SuperAdmin)
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      await Message.deleteOne({ _id: message._id });

      await AuditLog.create({
        adminId: req.admin._id,
        actionType: 'MESSAGE_DELETED',
        targetModel: 'Message',
        targetId: message._id,
        ipAddress: req.ip,
        details: `SuperAdmin deleted message`
      });

      res.status(200).json({ message: 'Message deleted completely' });
    } else {
      res.status(404);
      throw new Error('Message not found');
    }
  } catch (error) {
    next(error);
  }
};
