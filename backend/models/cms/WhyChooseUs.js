import mongoose from 'mongoose';
const schema = new mongoose.Schema({ title: String, description: String, icon: String, order: { type: Number, default: 0 } }, { timestamps: true });
export default mongoose.model('WhyChooseUs', schema);