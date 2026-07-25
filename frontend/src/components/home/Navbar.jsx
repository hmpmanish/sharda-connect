import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

import useCMSStore from '../../store/cmsStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data } = useCMSStore();
  const { websiteSettings, navigation } = data;
  const siteName = websiteSettings?.siteName || 'Sharda Connect';

  // Split siteName into two parts for gradient effect if there's a space, or just use the first word and second word
  const nameParts = siteName.split(' ');
  const firstPart = nameParts[0] || 'Sharda';
  const secondPart = nameParts.slice(1).join(' ') || 'Connect';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/40 backdrop-blur-md border-b border-white/5 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative group flex items-center gap-2">
            {websiteSettings?.logoUrl && (
              <img src={websiteSettings.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
            )}
            <span className="text-2xl font-black text-white tracking-tighter">
              {firstPart}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 group-hover:from-pink-400 group-hover:to-purple-400 transition-colors drop-shadow-[0_0_10px_rgba(255,46,136,0.5)]">
                {secondPart}
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation?.filter(l => !l.isButton).map((link) => (
              <a
                key={link._id || link.label}
                href={link.path}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-[0_0_20px_rgba(255,46,136,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0D0D0D]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navigation?.filter(l => !l.isButton).map((link) => (
                <a
                  key={link._id || link.label}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col space-y-3 px-3">
                <Link
                  to="/login"
                  className="w-full text-center text-gray-300 hover:text-white font-medium py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD] text-white py-3 rounded-lg font-semibold shadow-[0_0_15px_rgba(255,46,136,0.3)]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
