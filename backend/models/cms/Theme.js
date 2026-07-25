import mongoose from 'mongoose';
const schema = new mongoose.Schema({ primaryColor: String, secondaryColor: String, accentColor: String, backgroundColor: String, textColor: String, borderRadius: String, fontFamily: String }, { timestamps: true });
export default mongoose.model('Theme', schema);