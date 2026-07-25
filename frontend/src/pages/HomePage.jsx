import React, { useEffect } from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import FeatureSection from '../components/home/FeatureSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import AppPreview from '../components/home/AppPreview';
import CommunitySection from '../components/home/CommunitySection';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CallToAction from '../components/home/CallToAction';
import Footer from '../components/home/Footer';

const HomePage = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#FF2E88]/30 font-sans">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeatureSection />
        <WhyChooseUs />
        <AppPreview />
        <CommunitySection />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
