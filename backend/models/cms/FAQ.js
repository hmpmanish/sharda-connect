import mongoose from 'mongoose';
const schema = new mongoose.Schema({ question: String, answer: String, order: { type: Number, default: 0 } }, { timestamps: true });
export default mongoose.model('FAQ', schema);