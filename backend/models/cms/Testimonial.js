import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name: String, role: String, text: String, rating: { type: Number, default: 5 }, avatar: String, isPublished: { type: Boolean, default: true }, order: { type: Number, default: 0 } }, { timestamps: true });
export default mongoose.model('Testimonial', schema);