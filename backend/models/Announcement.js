import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    targetAudience: {
      type: String,
      enum: ['all', 'active', 'suspended'],
      default: 'all'
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    isSent: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
