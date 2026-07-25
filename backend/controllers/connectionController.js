import Connection from '../models/Connection.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Search users for connection
// @route   GET /api/connections/search
// @access  Private
export const searchUsers = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          $or: [
            { fullName: { $regex: req.query.keyword, $options: 'i' } },
            { course: { $regex: req.query.keyword, $options: 'i' } },
            { branch: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find({ ...keyword, _id: { $ne: req.user._id }, status: 'active' })
      .select('fullName profilePhoto course branch year semester')
      .limit(20);

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's connections (pending, accepted, blocked)
// @route   GET /api/connections
// @access  Private
export const getConnections = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
    })
      .populate('requester', 'fullName profilePhoto course')
      .populate('recipient', 'fullName profilePhoto course')
      .sort({ updatedAt: -1 });

    res.status(200).json(connections);
  } catch (error) {
    next(error);
  }
};

// @desc    Send connection request
// @route   POST /api/connections/request/:id
// @access  Private
export const sendConnectionRequest = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;

    if (targetUserId === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot connect with yourself');
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: targetUserId },
        { requester: targetUserId, recipient: req.user._id },
      ],
    });

    if (existingConnection) {
      res.status(400);
      throw new Error(`Connection already exists with status: ${existingConnection.status}`);
    }

    const connection = await Connection.create({
      requester: req.user._id,
      recipient: targetUserId,
      status: 'pending',
    });

    // Create Notification
    await Notification.create({
      user: targetUserId,
      sender: req.user._id,
      title: 'New Connection Request',
      message: `${req.user.fullName} sent you a connection request.`,
      type: 'connection_request',
      relatedId: connection._id
    });

    res.status(201).json(connection);
  } catch (error) {
    next(error);
  }
};

// @desc    Update connection status (accept/reject/block)
// @route   PUT /api/connections/:id
// @access  Private
export const updateConnectionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      res.status(404);
      throw new Error('Connection not found');
    }

    // Security check
    if (connection.recipient.toString() !== req.user._id.toString() && connection.requester.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this connection');
    }

    if (status === 'accepted') {
      if (connection.recipient.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the recipient can accept a request');
      }
      connection.status = 'accepted';
      
      await Notification.create({
        user: connection.requester,
        sender: req.user._id,
        title: 'Connection Accepted',
        message: `${req.user.fullName} accepted your connection request.`,
        type: 'connection_accepted',
        relatedId: connection._id
      });
    } else if (status === 'rejected') {
      connection.status = 'rejected';
    } else if (status === 'blocked') {
      connection.status = 'blocked';
      connection.blockedBy = req.user._id;
    }

    await connection.save();
    res.status(200).json(connection);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete connection
// @route   DELETE /api/connections/:id
// @access  Private
export const removeConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      res.status(404);
      throw new Error('Connection not found');
    }

    if (connection.recipient.toString() !== req.user._id.toString() && connection.requester.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this connection');
    }

    await Connection.deleteOne({ _id: connection._id });
    res.status(200).json({ message: 'Connection removed' });
  } catch (error) {
    next(error);
  }
};
