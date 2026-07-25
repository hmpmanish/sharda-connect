import mongoose from 'mongoose';
const schema = new mongoose.Schema({ description: String, copyright: String, developerCredit: String, quickLinks: [{ label: String, path: String }], companyLinks: [{ label: String, path: String }], legalLinks: [{ label: String, path: String }] }, { timestamps: true });
export default mongoose.model('Footer', schema);