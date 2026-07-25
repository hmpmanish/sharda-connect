import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiStar, FiSearch, FiMoreVertical, FiInbox } from 'react-icons/fi';
import io from 'socket.io-client';
import useAuthStore from '../store/authStore';

const Inbox = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMessages();

    // Socket Setup
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socket.on(`message-${user._id}`, (newMessage) => {
      setMessages((prev) => [newMessage, ...prev]);
    });

    return () => socket.disconnect();
  }, [user._id]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('/messages/inbox');
      setMessages(data);
      if (data.length > 0) setActiveMessage(data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    if (!messages.find(m => m._id === id)?.isRead) {
      try {
        await axios.put(`/messages/${id}/read`);
        setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSelectMessage = (msg) => {
    setActiveMessage(msg);
    handleMarkAsRead(msg._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      if (activeMessage?._id === id) setActiveMessage(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      await axios.put(`/messages/${id}/favorite`);
      setMessages(messages.map(m => m._id === id ? { ...m, isFavorite: !m.isFavorite } : m));
      if (activeMessage?._id === id) {
        setActiveMessage({ ...activeMessage, isFavorite: !activeMessage.isFavorite });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMessages = messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-3rem)] flex flex-col md:flex-row gap-4">
      {/* Messages List (Sidebar in desktop) */}
      <div className={`w-full md:w-1/3 glass-card flex flex-col ${activeMessage ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-light-border dark:border-dark-border">
          <h2 className="text-xl font-semibold mb-4">Inbox</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-muted" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-8 text-center text-light-muted">Loading...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-light-muted flex flex-col items-center">
              <FiInbox className="w-12 h-12 mb-3 opacity-50" />
              <p>No messages found.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div 
                key={msg._id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 border-b border-light-border dark:border-dark-border cursor-pointer transition-colors ${
                  activeMessage?._id === msg._id 
                    ? 'bg-primary/10 border-l-4 border-l-primary' 
                    : 'hover:bg-light-hover dark:hover:bg-dark-hover border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm flex items-center gap-2">
                    Anonymous 
                    {!msg.isRead && <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>}
                  </span>
                  <span className="text-xs text-light-muted">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-light-muted dark:text-dark-muted truncate">
                  {msg.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message View Area */}
      <div className={`w-full md:w-2/3 glass-card flex flex-col ${!activeMessage ? 'hidden md:flex' : 'flex'}`}>
        {activeMessage ? (
          <>
            <div className="p-4 border-b border-light-border dark:border-dark-border flex justify-between items-center bg-white/50 dark:bg-dark-card/50">
              <div className="flex items-center gap-3">
                <button 
                  className="md:hidden p-2 -ml-2 hover:bg-light-hover rounded-full"
                  onClick={() => setActiveMessage(null)}
                >
                  ←
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <h3 className="font-semibold">Anonymous Sender</h3>
                  <p className="text-xs text-light-muted">
                    {new Date(activeMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleToggleFavorite(activeMessage._id)}
                  className={`p-2 rounded-full transition-colors ${activeMessage.isFavorite ? 'text-yellow-500 bg-yellow-500/10' : 'text-light-muted hover:bg-light-hover dark:hover:bg-dark-hover'}`}
                  title="Favorite"
                >
                  <FiStar className={activeMessage.isFavorite ? 'fill-current' : ''} />
                </button>
                <button 
                  onClick={() => handleDelete(activeMessage._id)}
                  className="p-2 rounded-full text-light-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
                <button className="p-2 rounded-full text-light-muted hover:bg-light-hover dark:hover:bg-dark-hover transition-colors">
                  <FiMoreVertical />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-light-bg/50 dark:bg-dark-bg/50 custom-scrollbar flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMessage._id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="chat-bubble-received self-start shadow-sm text-lg"
                >
                  {activeMessage.content}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Reply Input (Disabled for now as per true anonymous design) */}
            <div className="p-4 border-t border-light-border dark:border-dark-border bg-white/50 dark:bg-dark-card/50">
               <div className="flex items-center gap-2">
                 <input 
                   type="text" 
                   disabled
                   placeholder="You cannot reply to anonymous messages directly..." 
                   className="input-field opacity-60 cursor-not-allowed"
                 />
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-light-muted">
            <FiInbox className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
