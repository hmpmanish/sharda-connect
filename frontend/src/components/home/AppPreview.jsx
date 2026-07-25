import { motion } from 'framer-motion';
import { FiPhoneCall, FiBell, FiUser, FiMessageCircle } from 'react-icons/fi';

const AppPreview = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#000000]">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#FF2E88]/10 to-[#9D4EDD]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            A beautiful, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD]">distraction-free</span> UI
          </h2>
          <p className="text-gray-400 text-lg">Designed to look stunning while keeping you focused on the conversation.</p>
        </div>

        <div className="relative h-[600px] md:h-[700px] flex justify-center items-center">
          
          {/* Main Desktop Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute z-10 w-[90%] md:w-[70%] h-[400px] md:h-[500px] bg-[#0A0A0A] rounded-[30px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
          >
            {/* Fake Mac Header */}
            <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            
            {/* Fake App Body */}
            <div className="flex-1 flex">
              <div className="w-1/4 border-r border-white/5 p-4 hidden md:block space-y-4">
                <div className="h-8 bg-white/10 rounded-lg w-3/4 mb-6"></div>
                <div className="h-12 bg-white/5 rounded-xl"></div>
                <div className="h-12 bg-gradient-to-r from-[#FF2E88]/20 to-transparent border-l-2 border-[#FF2E88] rounded-r-xl"></div>
                <div className="h-12 bg-white/5 rounded-xl"></div>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <div className="h-10 border-b border-white/5 mb-4 flex items-center justify-between">
                   <div className="h-6 w-32 bg-white/10 rounded-md"></div>
                   <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#FF2E88]"><FiPhoneCall size={14}/></div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#9D4EDD]"><FiUser size={14}/></div>
                   </div>
                </div>
                <div className="flex-1 flex flex-col justify-end space-y-4">
                   <div className="w-2/3 h-16 bg-white/5 rounded-2xl rounded-tl-none self-start"></div>
                   <div className="w-1/2 h-16 bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD] rounded-2xl rounded-tr-none self-end"></div>
                </div>
                <div className="mt-4 h-12 bg-white/5 rounded-full w-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Floating Mobile Mockup */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-20 left-[5%] md:left-[15%] bottom-[10%] w-[160px] md:w-[220px] h-[320px] md:h-[450px] bg-[#050505] rounded-[30px] border-[6px] border-[#1A1A1A] shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            <div className="h-full bg-gradient-to-b from-[#0D0D0D] to-[#000000] p-4 flex flex-col">
               <div className="w-1/2 h-4 bg-black absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl"></div>
               <div className="flex-1 mt-6 space-y-3">
                 <div className="w-full h-16 bg-[#1A1A1A] rounded-2xl flex items-center px-3 gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#FF2E88]/20 flex items-center justify-center text-[#FF2E88]"><FiBell /></div>
                   <div className="flex-1 space-y-2"><div className="h-2 w-full bg-white/10 rounded"></div><div className="h-2 w-2/3 bg-white/5 rounded"></div></div>
                 </div>
                 <div className="w-full h-16 bg-[#1A1A1A] rounded-2xl flex items-center px-3 gap-3">
                   <div className="w-10 h-10 rounded-full bg-[#9D4EDD]/20 flex items-center justify-center text-[#9D4EDD]"><FiMessageCircle /></div>
                   <div className="flex-1 space-y-2"><div className="h-2 w-full bg-white/10 rounded"></div><div className="h-2 w-2/3 bg-white/5 rounded"></div></div>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Floating UI Elements */}
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-30 right-[5%] md:right-[20%] top-[20%] bg-[#111] border border-[#FF2E88]/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(255,46,136,0.2)] backdrop-blur-xl flex items-center gap-3"
          >
             <div className="w-3 h-3 rounded-full bg-[#FF2E88] animate-pulse"></div>
             <span className="text-white font-medium text-sm">Incoming Video Call...</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AppPreview;
