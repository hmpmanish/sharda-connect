import mongoose from 'mongoose';
const schema = new mongoose.Schema({ label: String, path: String, order: { type: Number, default: 0 }, isButton: { type: Boolean, default: false }, buttonVariant: { type: String, enum: ['primary', 'secondary'], default: 'primary' } }, { timestamps: true });
export default mongoose.model('Navigation', schema);