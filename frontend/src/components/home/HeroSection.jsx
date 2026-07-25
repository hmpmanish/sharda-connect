import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiUsers, FiHeart, FiStar } from 'react-icons/fi';
import useCMSStore from '../../store/cmsStore';

const HeroSection = () => {
  const { data } = useCMSStore();
  const heroData = data.homepageContent?.hero || {};
  const statsData = data.homepageContent?.stats || [
    { label: "Active Students", value: "10k+" },
    { label: "Messages Sent", value: "2M+" },
    { label: "Connections", value: "50k+" },
  ];
  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#FF2E88]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#9D4EDD]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#FF2E88]/10 to-[#9D4EDD]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF2E88] animate-pulse" />
              <span className="text-sm font-medium text-gray-300">
                {heroData.subHeadline || 'The #1 Campus Connection Platform'}
              </span>
            </motion.div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6">
              {heroData.headline ? (
                <div dangerouslySetInnerHTML={{ __html: heroData.headline.replace(/\n/g, '<br/>') }} />
              ) : (
                <>
                  Connect.<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD]">
                    Chat.
                  </span><br/>
                  Belong.
                </>
              )}
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-400 mb-10 max-w-xl font-light leading-relaxed">
              {heroData.description || 'Meet students, make new friends, and enjoy secure conversations in one premium modern platform.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link 
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#FF2E88] text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,46,136,0.3)] hover:shadow-[0_0_50px_rgba(255,46,136,0.5)]"
              >
                <span className="relative z-10">{heroData.primaryButtonText || 'Get Started'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <a 
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md"
              >
                {heroData.secondaryButtonText || 'Explore Features'}
              </a>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              {statsData.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + (idx * 0.1) }}
                >
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Illustration / Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[600px] hidden lg:block"
          >
            {/* Main Chat Interface Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[550px] bg-[#0D0D0D]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-4 flex flex-col z-20">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF2E88] to-[#9D4EDD] p-[2px]">
                  <div className="w-full h-full bg-[#0D0D0D] rounded-full flex items-center justify-center">
                    <FiStar className="text-white w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Study Group Alpha</div>
                  <div className="text-[#FF2E88] text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E88] animate-pulse"></span> Online
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-4">
                <div className="self-start max-w-[80%] bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm p-3">
                  <p className="text-sm text-gray-300">Hey! Anyone up for a study session tonight? 📚</p>
                </div>
                <div className="self-end max-w-[80%] bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD] rounded-2xl rounded-tr-sm p-3 shadow-[0_5px_15px_rgba(255,46,136,0.2)]">
                  <p className="text-sm text-white">Count me in! I'll bring the notes. 🚀</p>
                </div>
                <div className="self-start max-w-[80%] bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm p-3">
                  <p className="text-sm text-gray-300">Awesome! See you at 8 PM at the library.</p>
                </div>
              </div>
              
              <div className="mt-4 bg-white/5 border border-white/10 rounded-full p-3 flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/10 rounded-full"></div>
                <div className="w-6 h-6 rounded-full bg-[#FF2E88] flex items-center justify-center shadow-[0_0_10px_rgba(255,46,136,0.5)]">
                  <FiHeart className="text-white w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-0 z-30 bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF2E88]/20 flex items-center justify-center text-[#FF2E88]">
                <FiMessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">New Confession</div>
                <div className="text-gray-400 text-xs">Someone likes your vibe...</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [15, -15, 15] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 -left-10 z-30 bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-[#9D4EDD]/20 flex items-center justify-center text-[#9D4EDD]">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">+5 New Members</div>
                <div className="text-gray-400 text-xs">Joined 'Tech Club'</div>
              </div>
            </motion.div>
            
            {/* Glow Behind Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[500px] bg-gradient-to-tr from-[#FF2E88] to-[#9D4EDD] opacity-20 blur-[80px] z-10 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
