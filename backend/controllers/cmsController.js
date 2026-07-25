import WebsiteSettings from '../models/cms/WebsiteSettings.js';
import HomepageContent from '../models/cms/HomepageContent.js';
import Navigation from '../models/cms/Navigation.js';
import Features from '../models/cms/Features.js';
import WhyChooseUs from '../models/cms/WhyChooseUs.js';
import Community from '../models/cms/Community.js';
import Testimonial from '../models/cms/Testimonial.js';
import FAQ from '../models/cms/FAQ.js';
import Footer from '../models/cms/Footer.js';
import SocialLinks from '../models/cms/SocialLinks.js';
import SEO from '../models/cms/SEO.js';
import Theme from '../models/cms/Theme.js';
import CustomPage from '../models/cms/CustomPage.js';
import MediaLibrary from '../models/cms/MediaLibrary.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all CMS data for frontend (Public)
// @route   GET /api/cms/public
// @access  Public
export const getPublicCMSData = async (req, res, next) => {
  try {
    const [
      websiteSettings,
      homepageContent,
      navigation,
      features,
      whyChooseUs,
      community,
      testimonials,
      faqs,
      footer,
      socialLinks,
      seo,
      theme
    ] = await Promise.all([
      WebsiteSettings.findOne({}),
      HomepageContent.findOne({}),
      Navigation.find({}).sort({ order: 1 }),
      Features.find({}).sort({ order: 1 }),
      WhyChooseUs.find({}).sort({ order: 1 }),
      Community.find({}).sort({ order: 1 }),
      Testimonial.find({ isPublished: true }).sort({ order: 1 }),
      FAQ.find({}).sort({ order: 1 }),
      Footer.findOne({}),
      SocialLinks.find({ isActive: true }),
      SEO.findOne({}),
      Theme.findOne({})
    ]);

    res.status(200).json({
      websiteSettings: websiteSettings || {},
      homepageContent: homepageContent || {},
      navigation: navigation || [],
      features: features || [],
      whyChooseUs: whyChooseUs || [],
      community: community || [],
      testimonials: testimonials || [],
      faqs: faqs || [],
      footer: footer || {},
      socialLinks: socialLinks || [],
      seo: seo || {},
      theme: theme || {}
    });
  } catch (error) {
    next(error);
  }
};

// Generic update function for Singleton models (Settings, Theme, Footer, etc.)
const updateSingleton = (Model, sectionName) => async (req, res, next) => {
  try {
    let doc = await Model.findOne({});
    if (!doc) {
      doc = new Model(req.body);
    } else {
      Object.assign(doc, req.body);
    }
    await doc.save();

    await AuditLog.create({
      adminId: req.admin._id,
      actionType: 'CMS_UPDATED',
      targetModel: sectionName,
      targetId: doc._id,
      ipAddress: req.ip,
      details: `SuperAdmin updated CMS section: ${sectionName}`
    });

    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
};

// Generic update function for Array models (Features, FAQs, etc)
// Assuming payload is { items: [...] }
const updateArray = (Model, sectionName) => async (req, res, next) => {
  try {
    const { items } = req.body;
    
    // Simple approach: clear and insert all
    await Model.deleteMany({});
    const inserted = await Model.insertMany(items);

    await AuditLog.create({
      adminId: req.admin._id,
      actionType: 'CMS_ARRAY_UPDATED',
      targetModel: sectionName,
      targetId: null,
      ipAddress: req.ip,
      details: `SuperAdmin updated CMS array: ${sectionName}`
    });

    res.status(200).json(inserted);
  } catch (error) {
    next(error);
  }
};

export const updateWebsiteSettings = updateSingleton(WebsiteSettings, 'WebsiteSettings');
export const updateHomepageContent = updateSingleton(HomepageContent, 'HomepageContent');
export const updateFooter = updateSingleton(Footer, 'Footer');
export const updateSEO = updateSingleton(SEO, 'SEO');
export const updateTheme = updateSingleton(Theme, 'Theme');

export const updateNavigation = updateArray(Navigation, 'Navigation');
export const updateFeatures = updateArray(Features, 'Features');
export const updateWhyChooseUs = updateArray(WhyChooseUs, 'WhyChooseUs');
export const updateCommunity = updateArray(Community, 'Community');
export const updateTestimonials = updateArray(Testimonial, 'Testimonial');
export const updateFAQs = updateArray(FAQ, 'FAQ');
export const updateSocialLinks = updateArray(SocialLinks, 'SocialLinks');

// --- Custom Pages ---
export const getCustomPages = async (req, res, next) => {
  try {
    const pages = await CustomPage.find({});
    res.status(200).json(pages);
  } catch (error) { next(error); }
};

export const createCustomPage = async (req, res, next) => {
  try {
    const page = await CustomPage.create(req.body);
    res.status(201).json(page);
  } catch (error) { next(error); }
};

export const updateCustomPage = async (req, res, next) => {
  try {
    const page = await CustomPage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(page);
  } catch (error) { next(error); }
};

export const deleteCustomPage = async (req, res, next) => {
  try {
    await CustomPage.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Page deleted' });
  } catch (error) { next(error); }
};

export const getCustomPageBySlug = async (req, res, next) => {
  try {
    const page = await CustomPage.findOne({ slug: req.params.slug });
    if(!page) return res.status(404).json({ message: 'Page not found' });
    res.status(200).json(page);
  } catch (error) { next(error); }
};
