import mongoose from 'mongoose';
const schema = new mongoose.Schema({ title: String, slug: { type: String, unique: true }, content: String, status: { type: String, enum: ['draft', 'published'], default: 'draft' } }, { timestamps: true });
export default mongoose.model('CustomPage', schema);