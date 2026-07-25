import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Send an anonymous message
// @route   POST /api/messages/send
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, replyTo } = req.body;
    const senderId = req.user._id;

    if (receiverId.toString() === senderId.toString()) {
      res.status(400);
      throw new Error('You cannot send a message to yourself');
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      res.status(404);
      throw new Error('Receiver not found');
    }

    if (!receiver.acceptAnonymousMessages) {
      res.status(403);
      throw new Error('This user is not accepting anonymous messages at the moment');
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      replyTo: replyTo || null,
    });

    // Create Notification
    const notification = await Notification.create({
      user: receiverId,
      title: 'New Anonymous Message',
      message: 'You have received a new anonymous message.',
      type: 'message',
      relatedId: message._id,
    });

    // Socket.io Real-time Event
    const io = req.app.get('io');
    io.emit(`notification-${receiverId}`, notification);
    io.emit(`message-${receiverId}`, message);

    res.status(201).json({ message: 'Message sent anonymously!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get received messages (Inbox)
// @route   GET /api/messages/inbox
// @access  Private
export const getInbox = async (req, res, next) => {
  try {
    const messages = await Message.find({ receiver: req.user._id, isArchived: false })
      .sort({ createdAt: -1 })
      .select('-sender'); // CRITICAL: Exclude sender to maintain anonymity

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    await Message.deleteOne({ _id: message._id });

    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Favorite
// @route   PUT /api/messages/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    message.isFavorite = !message.isFavorite;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};
