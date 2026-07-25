import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true }, // e.g., 'homepage', 'about', 'privacy', 'terms'
    title: { type: String, default: '' },
    body: { type: String, default: '' }, // Can store HTML or Markdown
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);
export default Content;
