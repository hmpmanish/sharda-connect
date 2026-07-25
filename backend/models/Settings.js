import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    websiteName: { type: String, default: 'Secret Confessions' },
    websiteLogo: { type: String, default: '' },
    maintenanceMode: { type: Boolean, default: false },
    registrationEnabled: { type: Boolean, default: true },
    anonymousMessagingEnabled: { type: Boolean, default: true },
    maxMessageLength: { type: Number, default: 2000 },
    themeColor: { type: String, default: 'rose' },
    smtp: {
      host: { type: String, default: '' },
      port: { type: Number, default: 587 },
      user: { type: String, default: '' },
      password: { type: String, default: '' },
    }
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
