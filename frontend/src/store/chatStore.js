import { create } from 'zustand';
import io from 'socket.io-client';
import axios from '../utils/axios';

const useChatStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  conversations: [],
  activeConversation: null,
  messages: [],
  isTyping: false,

  connectSocket: () => {
    const userStr = localStorage.getItem('user');
    const token = userStr ? JSON.parse(userStr).token : null;

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      withCredentials: true,
      auth: { token }
    });

    socket.on('connect', () => {
      // Socket connected
    });

    socket.on('user_online', (userId) => {
      set((state) => ({
        onlineUsers: [...new Set([...state.onlineUsers, userId])],
      }));
    });

    socket.on('user_offline', (userId) => {
      set((state) => ({
        onlineUsers: state.onlineUsers.filter((id) => id !== userId),
      }));
    });

    socket.on('receive_message', (message) => {
      const state = get();
      if (state.activeConversation && state.activeConversation._id === message.conversationId) {
        set((state) => ({ messages: [message, ...state.messages] }));
        
        // Mark as read immediately if chat is open
        socket.emit('mark_read', { conversationId: message.conversationId });
      } else {
        // Increment unread count in conversations list
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === message.conversationId
              ? { ...c, lastMessage: message } // Ideally, we'd also increment unread locally
              : c
          ),
        }));
      }
    });

    socket.on('user_typing', ({ conversationId, userId }) => {
      const state = get();
      if (state.activeConversation && state.activeConversation._id === conversationId) {
        set({ isTyping: true });
      }
    });

    socket.on('user_stopped_typing', ({ conversationId, userId }) => {
      const state = get();
      if (state.activeConversation && state.activeConversation._id === conversationId) {
        set({ isTyping: false });
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  },

  fetchConversations: async () => {
    try {
      const { data } = await axios.get('/conversations');
      set({ conversations: data });
    } catch (error) {
      console.error(error);
    }
  },

  setActiveConversation: async (conversation) => {
    set({ activeConversation: conversation });
    if (conversation) {
      const { socket } = get();
      socket?.emit('join_chat', conversation._id);
      
      try {
        const { data } = await axios.get(`/conversations/${conversation._id}/messages`);
        set({ messages: data });
        socket?.emit('mark_read', { conversationId: conversation._id });
      } catch (error) {
        console.error(error);
      }
    } else {
      set({ messages: [] });
    }
  },

  sendMessage: (content, targetUserId, replyTo = null) => {
    const { socket, activeConversation } = get();
    if (!socket || !activeConversation) return;

    socket.emit('send_message', {
      conversationId: activeConversation._id,
      content,
      targetUserId,
      replyTo,
    });
  },

  sendTypingStatus: (targetUserId, isTyping) => {
    const { socket, activeConversation } = get();
    if (!socket || !activeConversation) return;

    const event = isTyping ? 'typing' : 'stop_typing';
    socket.emit(event, { conversationId: activeConversation._id, targetUserId });
  },
}));

export default useChatStore;
