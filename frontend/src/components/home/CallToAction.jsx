import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useCMSStore from '../../store/cmsStore';

const CallToAction = () => {
  const { data } = useCMSStore();
  const ctaData = data.homepageContent?.cta || {};

  return (
    <section className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[40px] overflow-hidden p-12 md:p-20 text-center border border-white/10"
        >
          {/* Glowing Backgrounds */}
          <div className="absolute inset-0 bg-[#0D0D0D]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#FF2E88]/20 to-transparent opacity-50 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-1/2 bg-gradient-to-t from-[#9D4EDD]/20 to-transparent opacity-50 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              {ctaData.heading ? (
                <div dangerouslySetInnerHTML={{ __html: ctaData.heading.replace(/\n/g, '<br/>') }} />
              ) : (
                <>
                  Ready to Join the <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD]">Community?</span>
                </>
              )}
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
              {ctaData.description || "Don't miss out on what's happening on campus. Connect, chat, and belong today."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD] text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,46,136,0.3)] hover:shadow-[0_0_50px_rgba(255,46,136,0.5)]"
              >
                {ctaData.primaryButtonText || 'Create Account'}
              </Link>
              
              <a 
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md"
              >
                {ctaData.secondaryButtonText || 'Learn More'}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
