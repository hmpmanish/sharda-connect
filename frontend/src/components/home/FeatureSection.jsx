import { motion } from 'framer-motion';
import { FiMessageCircle, FiUsers, FiLock, FiVideo, FiShield, FiZap } from 'react-icons/fi';

import * as Icons from 'react-icons/fi';
import useCMSStore from '../../store/cmsStore';

const defaultFeatures = [
  {
    title: 'Private Chat',
    description: 'Secure one-to-one messaging with modern UI, read receipts, and rich media sharing.',
    icon: 'FiMessageCircle',
    color: 'from-[#FF2E88] to-[#FF6B6B]',
  },
  {
    title: 'Community Groups',
    description: 'Join groups based on your interests, courses, or clubs. Stay connected with your campus.',
    icon: 'FiUsers',
    color: 'from-[#9D4EDD] to-[#B392AC]',
  },
  {
    title: 'Anonymous Messages',
    description: 'Send and receive anonymous messages with complete privacy controls and filters.',
    icon: 'FiLock',
    color: 'from-[#00F5D4] to-[#00BBF9]',
  },
  {
    title: 'Voice & Video Calling',
    description: 'High-quality real-time communication built right into the browser. No extra apps needed.',
    icon: 'FiVideo',
    color: 'from-[#FEE440] to-[#F15BB5]',
  },
  {
    title: 'Privacy & Security',
    description: 'End-to-end JWT authentication and protected messaging to keep your data safe.',
    icon: 'FiShield',
    color: 'from-[#4361EE] to-[#3A0CA3]',
  },
  {
    title: 'Real-time Notifications',
    description: 'Instant updates with Socket.io so you never miss a message, call, or confession.',
    icon: 'FiZap',
    color: 'from-[#FF9E00] to-[#FF5400]',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const FeatureSection = () => {
  const { data } = useCMSStore();
  const features = data.features?.length > 0 ? data.features : defaultFeatures;

  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Everything you need to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD]">
              stay connected
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Experience the next generation of campus communication with our premium, feature-rich platform designed specifically for students.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => {
            const IconComponent = Icons[feature.icon] || Icons['FiCheckCircle'];
            const colorStr = feature.color || 'from-[#FF2E88] to-[#9D4EDD]';
            let stop1 = '#FF2E88';
            let stop2 = '#9D4EDD';
            if (colorStr.includes('from-[')) {
              stop1 = colorStr.split(' ')[0]?.replace('from-[', '')?.replace(']', '') || stop1;
              stop2 = colorStr.split(' ')[1]?.replace('to-[', '')?.replace(']', '') || stop2;
            }
            return (
            <motion.div 
              key={feature._id || idx}
              variants={itemVariants}
              className="group relative bg-[#0D0D0D] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              {/* Hover Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Subtle Animated Border Glow */}
              <div className={`absolute -inset-[1px] rounded-3xl bg-gradient-to-r ${colorStr} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500 -z-10`} />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  {/* SVG Gradient Hack for React Icons */}
                  <svg width="0" height="0">
                    <linearGradient id={`grad-${idx}`} x1="100%" y1="100%" x2="0%" y2="0%">
                      <stop stopColor={stop2} offset="0%" />
                      <stop stopColor={stop1} offset="100%" />
                    </linearGradient>
                  </svg>
                  {feature.icon && feature.icon.startsWith('http') ? (
                    <img src={feature.icon} alt={feature.title} className="w-8 h-8 object-contain" />
                  ) : (
                    <>
                      <IconComponent className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r ${colorStr}`} style={{ color: "url(#gradient)" }} />
                      <IconComponent className="w-6 h-6 absolute" style={{ stroke: `url(#grad-${idx})` }} />
                    </>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
