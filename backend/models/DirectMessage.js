import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    attachment: {
      url: String,
      publicId: String,
      fileType: String,
      originalName: String,
      fileSize: Number,
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    forwarded: {
      type: Boolean,
      default: false,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    reactions: {
      type: Map,
      of: String, // Map of userId to Emoji string
      default: {},
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DirectMessage',
    }
  },
  { timestamps: true }
);

directMessageSchema.index({ conversationId: 1, createdAt: -1 });

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);
export default DirectMessage;
