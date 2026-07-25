import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: String, category: String, membersCount: String, bgColor: String, textColor: String, order: { type: Number, default: 0 } }, { timestamps: true });
export default mongoose.model('Community', schema);