import { useEffect } from 'react';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import { format } from 'date-fns';

const ChatLayout = ({ children }) => {
  const { conversations, fetchConversations, activeConversation, setActiveConversation, onlineUsers } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return (
    <div className="flex h-[calc(100vh-6rem)] -m-4 md:-m-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No conversations yet. Connect with students to start chatting!
            </div>
          ) : (
            conversations.map((conv) => {
              const otherUser = conv.participants.find(p => p._id !== user._id);
              if (!otherUser) return null;
              
              const isOnline = onlineUsers.includes(otherUser._id);
              const unreadCount = conv.unreadCounts?.[user._id] || 0;
              const isActive = activeConversation?._id === conv._id;

              return (
                <div 
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800/50 ${isActive ? 'bg-rose-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <div className="relative">
                    <img 
                      src={otherUser.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.fullName)}`} 
                      alt={otherUser.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-sm truncate">{otherUser.fullName}</h3>
                      {conv.lastMessage && (
                        <span className="text-xs text-slate-400">
                          {format(new Date(conv.lastMessage.createdAt), 'p')}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500 truncate pr-2">
                        {conv.lastMessage?.content || 'Say hi! 👋'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          children
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
            <div className="text-center">
              <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                💭
              </div>
              <h3 className="text-xl font-bold mb-2">Your Messages</h3>
              <p className="text-slate-500 max-w-sm">Select a conversation from the sidebar or start a new one to begin chatting.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatLayout;
