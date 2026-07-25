import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';
import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import CallScreen from '../components/call/CallScreen';
import IncomingCallDialog from '../components/call/IncomingCallDialog';
import useCallStore from '../store/callStore';

const MainLayout = ({ isAdmin = false }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { connectSocket, disconnectSocket, fetchConversations } = useChatStore();
  const { socket } = useChatStore();
  const { setIncomingCall, callActive, endCall } = useCallStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
      fetchConversations();
    }
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, connectSocket, disconnectSocket, fetchConversations]);

  useEffect(() => {
    if (socket) {
      socket.on('call_user', (data) => {
        setIncomingCall(data);
      });
      socket.on('call_ended', () => {
        endCall();
      });
      socket.on('call_rejected', () => {
        endCall();
      });
      
      return () => {
        socket.off('call_user');
        socket.off('call_ended');
        socket.off('call_rejected');
      };
    }
  }, [socket, setIncomingCall, endCall]);

  if (!isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/login" : "/login"} replace />;
  }

  // Basic role check
  if (isAdmin && (!user || user.role === undefined)) {
     return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text selection:bg-primary/30">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar isAdmin={isAdmin} isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden glass-nav p-4 flex items-center justify-between z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <h1 className="font-semibold text-lg">Sharda Connect</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
      
      {/* WebRTC Calling UI */}
      <IncomingCallDialog />
      {callActive && <CallScreen />}
    </div>
  );
};

export default MainLayout;
