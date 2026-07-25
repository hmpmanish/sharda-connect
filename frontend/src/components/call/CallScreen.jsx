import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff, FiMaximize } from 'react-icons/fi';
import useCallStore from '../../store/callStore';
import useChatStore from '../../store/chatStore';

const CallScreen = () => {
  const {
    stream,
    callAccepted,
    callEnded,
    caller,
    callerSignal,
    callType,
    name,
    endCall,
    isReceivingCall,
    setStream
  } = useCallStore();
  const { socket, user } = useChatStore();

  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(callType === 'video');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const timerRef = useRef();

  useEffect(() => {
    // Setup local stream
    navigator.mediaDevices.getUserMedia({ video: callType === 'video', audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });
  }, [callType, setStream]);

  useEffect(() => {
    if (callAccepted && !callEnded) {
      // Start timer
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callAccepted, callEnded]);

  const answerCall = () => {
    useCallStore.setState({ callAccepted: true });
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('answer_call', { signal: data, to: caller });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    endCall();
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    socket.emit('end_call', { to: caller });
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !micEnabled;
      setMicEnabled(!micEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream && callType === 'video') {
      stream.getVideoTracks()[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col items-center justify-center p-4 transition-all duration-300 ${isFullScreen ? 'inset-0' : 'bottom-4 right-4 w-80 h-96 rounded-2xl shadow-2xl'}`}>
      <div className="absolute top-4 left-4 z-10 flex flex-col">
        <h2 className="text-xl font-bold">{name || 'Unknown User'}</h2>
        <span className="text-sm opacity-70">
          {callAccepted ? formatTime(callDuration) : 'Connecting...'}
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button onClick={() => setIsFullScreen(!isFullScreen)} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
          <FiMaximize size={20} />
        </button>
      </div>

      {/* Videos */}
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black">
        {/* Remote Video */}
        {callAccepted && !callEnded && callType === 'video' ? (
          <video playsInline ref={userVideo} autoPlay className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800">
            <div className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center text-4xl mb-4">
              {name ? name[0].toUpperCase() : '?'}
            </div>
          </div>
        )}

        {/* Local Video Picture-in-Picture */}
        {stream && callType === 'video' && (
          <div className="absolute bottom-20 right-4 w-24 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg">
            <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 flex items-center justify-center space-x-6">
        <button onClick={toggleMic} className={`p-4 rounded-full ${micEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
          {micEnabled ? <FiMic size={24} /> : <FiMicOff size={24} />}
        </button>
        {callType === 'video' && (
          <button onClick={toggleVideo} className={`p-4 rounded-full ${videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
            {videoEnabled ? <FiVideo size={24} /> : <FiVideoOff size={24} />}
          </button>
        )}
        <button onClick={leaveCall} className="p-4 rounded-full bg-red-600 hover:bg-red-700">
          <FiPhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

export default CallScreen;
