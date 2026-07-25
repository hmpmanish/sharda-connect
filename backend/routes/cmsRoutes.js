import express from 'express';
import { adminProtect, requireSuperAdmin } from '../middlewares/authMiddleware.js';
import {
  getPublicCMSData,
  updateWebsiteSettings,
  updateHomepageContent,
  updateFooter,
  updateSEO,
  updateTheme,
  updateNavigation,
  updateFeatures,
  updateWhyChooseUs,
  updateCommunity,
  updateTestimonials,
  updateFAQs,
  updateSocialLinks,
  getCustomPages,
  createCustomPage,
  updateCustomPage,
  deleteCustomPage,
  getCustomPageBySlug
} from '../controllers/cmsController.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
// Frontend will hit this on initial load to populate Zustand store
router.get('/public', getPublicCMSData);
router.get('/pages/:slug', getCustomPageBySlug);

// --- PROTECTED SUPER ADMIN ROUTES ---
router.use(adminProtect, requireSuperAdmin);

router.get('/all', getPublicCMSData); // Same data structure for Admin to edit

// Singleton Updates
router.put('/settings', updateWebsiteSettings);
router.put('/homepage', updateHomepageContent);
router.put('/footer', updateFooter);
router.put('/seo', updateSEO);
router.put('/theme', updateTheme);

// Array Updates
router.put('/navigation', updateNavigation);
router.put('/features', updateFeatures);
router.put('/why-choose-us', updateWhyChooseUs);
router.put('/community', updateCommunity);
router.put('/testimonials', updateTestimonials);
router.put('/faqs', updateFAQs);
router.put('/social-links', updateSocialLinks);

// Custom Pages
router.get('/pages', getCustomPages);
router.post('/pages', createCustomPage);
router.put('/pages/:id', updateCustomPage);
router.delete('/pages/:id', deleteCustomPage);

export default router;
