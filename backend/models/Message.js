import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    // Admin features
    isArchived: {
      type: Boolean,
      default: false,
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
    spamScore: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);
// Indexes for performance optimization
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ isArchived: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
