import Conversation from '../models/Conversation.js';
import DirectMessage from '../models/DirectMessage.js';
import Connection from '../models/Connection.js';

// @desc    Get user's conversations
// @route   GET /api/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'fullName profilePhoto')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get or Create Conversation with a user
// @route   POST /api/conversations
// @access  Private
export const createOrGetConversation = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;

    // Verify connection exists and is accepted
    const connection = await Connection.findOne({
      status: 'accepted',
      $or: [
        { requester: req.user._id, recipient: targetUserId },
        { requester: targetUserId, recipient: req.user._id },
      ],
    });

    if (!connection) {
      res.status(403);
      throw new Error('You must be connected to message this user');
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, targetUserId] }
    }).populate('participants', 'fullName profilePhoto');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, targetUserId],
        unreadCounts: {
          [req.user._id]: 0,
          [targetUserId]: 0
        }
      });
      // Populate participants for the frontend
      conversation = await conversation.populate('participants', 'fullName profilePhoto');
    }

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/conversations/:id/messages
// @access  Private
export const getDirectMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      res.status(404);
      throw new Error('Conversation not found');
    }

    if (!conversation.participants.includes(req.user._id)) {
      res.status(403);
      throw new Error('Not authorized to view these messages');
    }

    const messages = await DirectMessage.find({ conversationId: conversation._id })
      .populate('sender', 'fullName profilePhoto')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(50); // Paginate eventually

    // Reset unread count
    if (conversation.unreadCounts.get(req.user._id.toString()) > 0) {
      conversation.unreadCounts.set(req.user._id.toString(), 0);
      await conversation.save();
    }

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
