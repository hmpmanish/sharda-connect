import mongoose from 'mongoose';
const schema = new mongoose.Schema({ siteName: { type: String, default: 'Sharda Connect' }, logoUrl: { type: String, default: '' } }, { timestamps: true });
export default mongoose.model('WebsiteSettings', schema);