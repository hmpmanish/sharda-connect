import mongoose from 'mongoose';
const schema = new mongoose.Schema({ title: String, description: String, keywords: String, ogImage: String, favicon: String, googleAnalyticsId: String }, { timestamps: true });
export default mongoose.model('SEO', schema);