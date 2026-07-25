import { create } from 'zustand';
import axios from 'axios';

const useCMSStore = create((set, get) => ({
  data: {
    websiteSettings: {},
    homepageContent: {},
    navigation: [],
    features: [],
    whyChooseUs: [],
    community: [],
    testimonials: [],
    faqs: [],
    footer: {},
    socialLinks: [],
    seo: {},
    theme: {},
  },
  isLoading: true,
  error: null,

  fetchCMSData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch public CMS data
      const res = await axios.get('/api/cms/public');
      
      const theme = res.data.theme || {};
      // Apply theme CSS variables to document root dynamically
      const root = document.documentElement;
      if (theme.primaryColor) root.style.setProperty('--color-primary', theme.primaryColor);
      if (theme.secondaryColor) root.style.setProperty('--color-secondary', theme.secondaryColor);
      if (theme.accentColor) root.style.setProperty('--color-accent', theme.accentColor);
      if (theme.backgroundColor) root.style.setProperty('--color-background', theme.backgroundColor);
      
      set({ data: res.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching CMS data:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Generic updater for Admin Panel to optimistic UI update
  updateCMSSection: (section, payload) => {
    set((state) => ({
      data: {
        ...state.data,
        [section]: payload
      }
    }));
  }
}));

export default useCMSStore;
