import mongoose from 'mongoose';

const callHistorySchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['voice', 'video'],
      required: true,
    },
    status: {
      type: String,
      enum: ['missed', 'rejected', 'completed', 'ongoing', 'ended'],
      default: 'ongoing',
    },
    duration: {
      type: Number, // duration in seconds
      default: 0,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

callHistorySchema.index({ caller: 1, createdAt: -1 });
callHistorySchema.index({ receiver: 1, createdAt: -1 });

const CallHistory = mongoose.model('CallHistory', callHistorySchema);
export default CallHistory;
