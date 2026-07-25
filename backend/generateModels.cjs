const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'models', 'cms');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const templates = {
  'WebsiteSettings.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ siteName: { type: String, default: 'Sharda Connect' }, logoUrl: { type: String, default: '' } }, { timestamps: true });\nexport default mongoose.model('WebsiteSettings', schema);`,
  'HomepageContent.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ hero: { headline: String, subHeadline: String, primaryButtonText: String, secondaryButtonText: String, backgroundType: String }, cta: { heading: String, description: String, primaryButtonText: String, secondaryButtonText: String }, stats: [{ label: String, value: String }] }, { timestamps: true });\nexport default mongoose.model('HomepageContent', schema);`,
  'Navigation.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ label: String, path: String, order: { type: Number, default: 0 }, isButton: { type: Boolean, default: false }, buttonVariant: { type: String, enum: ['primary', 'secondary'], default: 'primary' } }, { timestamps: true });\nexport default mongoose.model('Navigation', schema);`,
  'Features.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ title: String, description: String, icon: String, color: String, order: { type: Number, default: 0 } }, { timestamps: true });\nexport default mongoose.model('Features', schema);`,
  'WhyChooseUs.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ title: String, description: String, icon: String, order: { type: Number, default: 0 } }, { timestamps: true });\nexport default mongoose.model('WhyChooseUs', schema);`,
  'Community.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ name: String, category: String, membersCount: String, bgColor: String, textColor: String, order: { type: Number, default: 0 } }, { timestamps: true });\nexport default mongoose.model('Community', schema);`,
  'Testimonial.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ name: String, role: String, text: String, rating: { type: Number, default: 5 }, avatar: String, isPublished: { type: Boolean, default: true }, order: { type: Number, default: 0 } }, { timestamps: true });\nexport default mongoose.model('Testimonial', schema);`,
  'FAQ.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ question: String, answer: String, order: { type: Number, default: 0 } }, { timestamps: true });\nexport default mongoose.model('FAQ', schema);`,
  'Footer.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ description: String, copyright: String, developerCredit: String, quickLinks: [{ label: String, path: String }], companyLinks: [{ label: String, path: String }], legalLinks: [{ label: String, path: String }] }, { timestamps: true });\nexport default mongoose.model('Footer', schema);`,
  'SocialLinks.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ platform: String, url: String, icon: String, isActive: { type: Boolean, default: true } }, { timestamps: true });\nexport default mongoose.model('SocialLinks', schema);`,
  'SEO.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ title: String, description: String, keywords: String, ogImage: String, favicon: String, googleAnalyticsId: String }, { timestamps: true });\nexport default mongoose.model('SEO', schema);`,
  'Theme.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ primaryColor: String, secondaryColor: String, accentColor: String, backgroundColor: String, textColor: String, borderRadius: String, fontFamily: String }, { timestamps: true });\nexport default mongoose.model('Theme', schema);`,
  'CustomPage.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ title: String, slug: { type: String, unique: true }, content: String, status: { type: String, enum: ['draft', 'published'], default: 'draft' } }, { timestamps: true });\nexport default mongoose.model('CustomPage', schema);`,
  'MediaLibrary.js': `import mongoose from 'mongoose';\nconst schema = new mongoose.Schema({ url: String, publicId: String, format: String, originalName: String, size: Number }, { timestamps: true });\nexport default mongoose.model('MediaLibrary', schema);`,
};

for (const [filename, content] of Object.entries(templates)) {
  fs.writeFileSync(path.join(dir, filename), content);
}
console.log('CMS Models created successfully.');
