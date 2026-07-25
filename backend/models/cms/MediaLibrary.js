import mongoose from 'mongoose';
const schema = new mongoose.Schema({ url: String, publicId: String, format: String, originalName: String, size: Number }, { timestamps: true });
export default mongoose.model('MediaLibrary', schema);