import { motion } from 'framer-motion';
import { FiZap, FiShield, FiLayout, FiSmile, FiRadio, FiMonitor } from 'react-icons/fi';

import * as Icons from 'react-icons/fi';
import useCMSStore from '../../store/cmsStore';

const defaultReasons = [
  { icon: 'FiZap', title: "Lightning Fast", description: "Built with Vite & React for instant page loads and zero lag during chats." },
  { icon: 'FiShield', title: "Bank-Grade Security", description: "Your data is encrypted and secure. We value your privacy above all." },
  { icon: 'FiLayout', title: "Premium Design", description: "An intuitive, glassmorphism UI that looks stunning in Dark Mode." },
  { icon: 'FiSmile', title: "Student Friendly", description: "Tailored specifically for campus life, study groups, and socializing." },
  { icon: 'FiRadio', title: "Real-Time Sync", description: "Watch messages appear instantly across all your devices." },
  { icon: 'FiMonitor', title: "Fully Responsive", description: "A flawless experience whether on your laptop, tablet, or smartphone." }
];

const WhyChooseUs = () => {
  const { data } = useCMSStore();
  const reasons = data.whyChooseUs?.length > 0 ? data.whyChooseUs : defaultReasons;

  return (
    <section className="py-24 relative z-10 border-t border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Why students <br/>
              <span className="text-[#FF2E88]">prefer</span> Sharda Connect
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
              We ditched the clunky, outdated university portals for a sleek, lightning-fast platform that actually feels good to use. Here is why thousands of students make the switch.
            </p>
            
            <div className="flex gap-4">
              <div className="w-1.5 rounded-full bg-gradient-to-b from-[#FF2E88] to-[#9D4EDD]" />
              <div>
                <h4 className="text-white font-bold text-xl mb-2">Built for the Modern Web</h4>
                <p className="text-gray-500 text-sm">Powered by the MERN stack, offering real-time WebSockets and optimized performance.</p>
              </div>
            </div>
          </motion.div>

          {/* Right Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {reasons.map((reason, idx) => {
              const IconComponent = Icons[reason.icon] || Icons['FiCheckCircle'];
              return (
              <div 
                key={reason._id || idx}
                className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 hover:border-[#FF2E88]/30 hover:bg-white/[0.02] transition-all group"
              >
                {reason.icon && reason.icon.startsWith('http') ? (
                  <img src={reason.icon} alt={reason.title} className="w-8 h-8 mb-4 object-contain" />
                ) : (
                  <IconComponent className="w-8 h-8 text-[#9D4EDD] group-hover:text-[#FF2E88] transition-colors mb-4" />
                )}
                <h4 className="text-white font-bold mb-2">{reason.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{reason.description || reason.desc}</p>
              </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
