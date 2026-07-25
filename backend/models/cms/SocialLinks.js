import mongoose from 'mongoose';
const schema = new mongoose.Schema({ platform: String, url: String, icon: String, isActive: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.model('SocialLinks', schema);