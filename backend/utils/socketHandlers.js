import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import DirectMessage from '../models/DirectMessage.js';
import Notification from '../models/Notification.js';

const onlineUsers = new Map(); // Map userId -> socketId

export const setupSocketHandlers = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next(new Error('Authentication error'));
      
      const token = cookieHeader.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
      if (!token) return next(new Error('Authentication error'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) return next(new Error('Authentication error'));
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);

    // Join personal room for targeted events (like notifications)
    socket.join(`user_${userId}`);
    
    // Broadcast online status to all
    io.emit('user_online', userId);

    // Get online status of a specific user
    socket.on('check_online_status', (targetUserId, callback) => {
      const isOnline = onlineUsers.has(targetUserId);
      callback({ isOnline });
    });

    // Chat Events
    socket.on('join_chat', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('leave_chat', (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on('typing', ({ conversationId, targetUserId }) => {
      const targetSocketId = onlineUsers.get(targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('user_typing', { conversationId, userId });
      }
    });

    socket.on('stop_typing', ({ conversationId, targetUserId }) => {
      const targetSocketId = onlineUsers.get(targetUserId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('user_stopped_typing', { conversationId, userId });
      }
    });

    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content, targetUserId, replyTo, attachment, forwarded } = data;

        // Verify conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) return;

        const newMessage = await DirectMessage.create({
          conversationId,
          sender: userId,
          content,
          replyTo: replyTo || null,
          attachment: attachment || null,
          forwarded: forwarded || false,
          readBy: [userId],
        });

        const populatedMessage = await DirectMessage.findById(newMessage._id)
          .populate('sender', 'fullName profilePhoto')
          .populate('replyTo');

        // Update conversation last message and unread counts
        conversation.lastMessage = newMessage._id;
        
        // Increment unread count for target user
        const currentUnread = conversation.unreadCounts.get(targetUserId) || 0;
        conversation.unreadCounts.set(targetUserId, currentUnread + 1);
        await conversation.save();

        // Emit to the conversation room (both users if they have the chat open)
        io.to(conversationId).emit('receive_message', populatedMessage);

        // Also emit a notification event to the target user if they don't have the chat open
        const targetSocketId = onlineUsers.get(targetUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit('new_message_notification', {
            conversationId,
            message: populatedMessage
          });
        }
      } catch (error) {
        console.error('Socket Send Message Error:', error);
      }
    });

    socket.on('mark_read', async ({ conversationId }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        // Reset unread count
        conversation.unreadCounts.set(userId, 0);
        await conversation.save();

        // Add user to readBy array in messages
        await DirectMessage.updateMany(
          { conversationId, readBy: { $ne: userId } },
          { $push: { readBy: userId } }
        );

        // Notify other participants that messages were read
        socket.to(conversationId).emit('messages_read', { conversationId, userId });
      } catch (error) {
        console.error('Socket Mark Read Error:', error);
      }
    });

    socket.on('delete_message', async ({ messageId, conversationId }) => {
      try {
        const message = await DirectMessage.findById(messageId);
        if (message && message.sender.toString() === userId) {
          message.isDeleted = true;
          await message.save();
          io.to(conversationId).emit('message_deleted', { messageId, conversationId });
        }
      } catch (error) {
        console.error('Socket Delete Message Error:', error);
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user_offline', userId);
    });

    // --- WebRTC Calling Events ---
    socket.on('call_user', (data) => {
      const { userToCall, signalData, from, name, callType } = data;
      const targetSocketId = onlineUsers.get(userToCall);
      if (targetSocketId) {
        io.to(targetSocketId).emit('call_user', {
          signal: signalData,
          from,
          name,
          callType,
        });
      }
    });

    socket.on('answer_call', (data) => {
      const targetSocketId = onlineUsers.get(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('call_accepted', data.signal);
      }
    });

    socket.on('end_call', (data) => {
      const targetSocketId = onlineUsers.get(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('call_ended');
      }
    });

    socket.on('reject_call', (data) => {
      const targetSocketId = onlineUsers.get(data.to);
      if (targetSocketId) {
        io.to(targetSocketId).emit('call_rejected');
      }
    });

    // --- Enhanced Chat Events ---
    socket.on('edit_message', async ({ messageId, conversationId, newContent }) => {
      try {
        const message = await DirectMessage.findById(messageId);
        if (message && message.sender.toString() === userId && !message.isDeleted) {
          message.content = newContent;
          message.isEdited = true;
          await message.save();
          
          const populatedMessage = await DirectMessage.findById(messageId)
            .populate('sender', 'fullName profilePhoto')
            .populate('replyTo');
          io.to(conversationId).emit('message_edited', populatedMessage);
        }
      } catch (error) {
        console.error('Socket Edit Message Error:', error);
      }
    });

    socket.on('pin_message', async ({ messageId, conversationId, isPinned }) => {
      try {
        const message = await DirectMessage.findById(messageId);
        if (message && !message.isDeleted) {
          message.pinned = isPinned;
          await message.save();
          io.to(conversationId).emit('message_pinned', { messageId, isPinned });
        }
      } catch (error) {
        console.error('Socket Pin Message Error:', error);
      }
    });

    socket.on('message_delivered', async ({ messageId, conversationId }) => {
      try {
        const message = await DirectMessage.findById(messageId);
        if (message && message.status === 'sent') {
          message.status = 'delivered';
          await message.save();
          io.to(conversationId).emit('message_status_update', { messageId, status: 'delivered' });
        }
      } catch (error) {
        console.error('Socket Delivered Error:', error);
      }
    });

  });
};
