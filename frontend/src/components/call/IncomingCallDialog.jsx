import React from 'react';
import useCallStore from '../../store/callStore';
import useChatStore from '../../store/chatStore';
import { FiPhone, FiPhoneOff, FiVideo } from 'react-icons/fi';

const IncomingCallDialog = () => {
  const { isReceivingCall, callAccepted, caller, name, callType, endCall } = useCallStore();
  const { socket } = useChatStore();

  const handleAccept = () => {
    useCallStore.setState({ callAccepted: true });
  };

  const handleReject = () => {
    socket.emit('reject_call', { to: caller });
    endCall();
  };

  if (!isReceivingCall || callAccepted) return null;

  return (
    <div className="fixed top-4 right-4 z-[150] w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 flex flex-col transform transition-all duration-300">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {name ? name[0].toUpperCase() : '?'}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Incoming {callType} call...</p>
        </div>
      </div>
      
      <div className="flex justify-between space-x-4">
        <button 
          onClick={handleReject}
          className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-600 p-3 rounded-lg flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition"
        >
          <FiPhoneOff className="mr-2" /> Decline
        </button>
        <button 
          onClick={handleAccept}
          className="flex-1 bg-green-500 text-white p-3 rounded-lg flex items-center justify-center hover:bg-green-600 transition shadow-lg shadow-green-500/30"
        >
          {callType === 'video' ? <FiVideo className="mr-2" /> : <FiPhone className="mr-2" />} Accept
        </button>
      </div>
    </div>
  );
};

export default IncomingCallDialog;
