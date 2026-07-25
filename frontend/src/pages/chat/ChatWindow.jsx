import { useState, useRef, useEffect } from 'react';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import { format } from 'date-fns';
import { FiSend, FiArrowLeft, FiMoreVertical, FiPhone, FiVideo, FiPaperclip, FiImage, FiSmile, FiX, FiDownload } from 'react-icons/fi';
import ChatLayout from './ChatLayout';
import useCallStore from '../../store/callStore';
import Peer from 'simple-peer';

const ChatWindow = () => {
  const { activeConversation, setActiveConversation, messages, sendMessage, sendTypingStatus, isTyping, onlineUsers, socket } = useChatStore();
  const { user } = useAuthStore();
  const { setStream, setIncomingCall } = useCallStore();
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    
    // Preview for images
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => setAttachment({ file, type: 'image', preview: e.target.result, name: file.name });
      reader.readAsDataURL(file);
    } else {
      setAttachment({ file, type: 'file', name: file.name });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!content.trim() && !attachment) || !activeConversation) return;

    const targetUserId = activeConversation.participants.find(p => p._id !== user._id)?._id;
    
    let uploadedAttachment = null;
    
    if (attachment) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', attachment.file);
        
        const endpoint = attachment.type === 'image' ? '/media/upload/image' : '/media/upload/file';
        // Note: we need to import axios if not already imported
        const axios = (await import('../../utils/axios')).default;
        const res = await axios.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        uploadedAttachment = {
          url: res.data.url,
          publicId: res.data.publicId,
          fileType: res.data.fileType,
          originalName: res.data.originalName,
          fileSize: res.data.fileSize
        };
      } catch (error) {
        console.error('Upload failed', error);
        alert('Failed to upload file');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    // Modify sendMessage in chatStore to accept attachment
    socket.emit('send_message', {
      conversationId: activeConversation._id,
      content,
      targetUserId,
      attachment: uploadedAttachment
    });
    
    setContent('');
    setAttachment(null);
    sendTypingStatus(targetUserId, false);
  };

  const handleTyping = (e) => {
    setContent(e.target.value);
    
    if (!activeConversation) return;
    const targetUserId = activeConversation.participants.find(p => p._id !== user._id)?._id;
    
    sendTypingStatus(targetUserId, true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(targetUserId, false);
    }, 2000);
  };

  const startCall = (type) => {
    const targetUserId = activeConversation.participants.find(p => p._id !== user._id)?._id;
    const targetUserName = activeConversation.participants.find(p => p._id !== user._id)?.fullName;
    
    navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true }).then((currentStream) => {
      setStream(currentStream);

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: currentStream,
      });

      peer.on('signal', (data) => {
        socket.emit('call_user', {
          userToCall: targetUserId,
          signalData: data,
          from: user._id,
          name: user.fullName,
          callType: type,
        });
      });

      // Update local store to show ringing state
      useCallStore.setState({
        callActive: true,
        caller: targetUserId,
        name: targetUserName,
        callType: type,
        callAccepted: false,
        isReceivingCall: false,
      });

      peer.on('stream', (remoteStream) => {
        // Handled in CallScreen
      });

      // We should ideally pass this peer to the CallScreen store. For simplicity we can store it in a global ref or state, 
      // but since CallScreen handles the accepted call differently, we might need a slight refactor.
    }).catch(err => {
      console.error('Failed to get media devices', err);
      alert('Camera/Microphone permission denied.');
    });
  };

  if (!activeConversation) return <ChatLayout />;

  const otherUser = activeConversation.participants.find(p => p._id !== user._id);
  const isOnline = onlineUsers.includes(otherUser?._id);

  return (
    <ChatLayout>
      {/* Header */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveConversation(null)}
            className="md:hidden p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          
          <img 
            src={otherUser?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.fullName || '')}`} 
            alt={otherUser?.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{otherUser?.fullName}</h3>
            <p className="text-xs text-slate-500">
              {isOnline ? <span className="text-emerald-500">Online</span> : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => startCall('voice')} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <FiPhone className="w-5 h-5" />
          </button>
          <button onClick={() => startCall('video')} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
            <FiVideo className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2">
            <FiMoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/20">
        <div className="flex flex-col-reverse">
          <div ref={messagesEndRef} />
          {messages.map((msg) => {
            const isMe = msg.sender._id === user._id;
            return (
              <div key={msg._id} className={`flex max-w-[75%] ${isMe ? 'ml-auto justify-end' : 'mr-auto justify-start'} mb-4`}>
                <div className={`rounded-2xl px-4 py-2 ${isMe ? 'bg-rose-500 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-bl-none shadow-sm'}`}>
                  {msg.attachment && (
                    <div className="mb-2">
                      {msg.attachment.fileType.startsWith('image/') ? (
                        <a href={msg.attachment.url} target="_blank" rel="noreferrer">
                          <img src={msg.attachment.url} alt="attachment" className="max-w-[200px] max-h-[200px] rounded-lg object-cover mb-1" />
                        </a>
                      ) : (
                        <a href={msg.attachment.url} target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-black/10 dark:bg-white/10 p-2 rounded-lg hover:bg-black/20 transition-colors">
                          <FiDownload className="w-5 h-5" />
                          <span className="text-sm underline truncate max-w-[150px]">{msg.attachment.originalName}</span>
                        </a>
                      )}
                    </div>
                  )}
                  {msg.content && <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>}
                  <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-rose-200' : 'text-slate-400'}`}>
                    {format(new Date(msg.createdAt), 'p')} {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-4 py-2 text-xs text-slate-500 italic bg-white dark:bg-slate-900">
          {otherUser?.fullName} is typing...
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        {attachment && (
          <div className="mb-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              {attachment.type === 'image' ? (
                <img src={attachment.preview} alt="preview" className="w-10 h-10 object-cover rounded" />
              ) : (
                <FiPaperclip className="w-8 h-8 p-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-500" />
              )}
              <span className="text-sm truncate max-w-[200px]">{attachment.name}</span>
            </div>
            <button onClick={() => setAttachment(null)} className="text-red-500 hover:bg-red-100 p-1 rounded">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <FiPaperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={content}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-rose-500"
          />
          <button 
            type="submit"
            disabled={(content.trim() === '' && !attachment) || isUploading}
            className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-rose-500/20"
          >
            {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSend className="w-5 h-5 -ml-1" />}
          </button>
        </form>
      </div>
    </ChatLayout>
  );
};

export default ChatWindow;
