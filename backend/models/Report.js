import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    targetDirectMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DirectMessage',
    },
    reason: {
      type: String,
      required: true,
      enum: ['Harassment', 'Spam', 'Inappropriate Content', 'Threatening', 'Other'],
    },
    description: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'rejected'],
      default: 'pending'
    },
    adminNotes: {
      type: String,
      default: ''
    },
    actionTaken: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
