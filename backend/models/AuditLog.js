import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    actionType: {
      type: String,
      required: true, // e.g., 'USER_BANNED', 'MESSAGE_DELETED', 'SETTINGS_UPDATED'
    },
    targetModel: {
      type: String, // e.g., 'User', 'Message', 'Settings'
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    browser: {
      type: String,
    }
  },
  { timestamps: true }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
