import { create } from 'zustand';

const useCallStore = create((set, get) => ({
  isReceivingCall: false,
  caller: null,
  callerSignal: null,
  callAccepted: false,
  callEnded: false,
  stream: null,
  name: '',
  callType: 'voice',
  callActive: false, // is there any active call process (incoming or ongoing)

  setStream: (stream) => set({ stream }),
  
  setIncomingCall: ({ from, name, signal, callType }) => 
    set({
      isReceivingCall: true,
      caller: from,
      name,
      callerSignal: signal,
      callType,
      callActive: true,
      callAccepted: false,
      callEnded: false
    }),

  acceptCall: () => set({ callAccepted: true, isReceivingCall: false }),
  
  endCall: () => {
    const { stream } = get();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    set({
      callEnded: true,
      callActive: false,
      isReceivingCall: false,
      caller: null,
      callerSignal: null,
      callAccepted: false,
    });
  },

  resetCall: () => set({
    isReceivingCall: false,
    caller: null,
    callerSignal: null,
    callAccepted: false,
    callEnded: false,
    callActive: false,
  }),
}));

export default useCallStore;
