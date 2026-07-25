import { motion } from 'framer-motion';

import useCMSStore from '../../store/cmsStore';

const defaultTestimonials = [
  { name: "Sarah M.", role: "Computer Science '25", text: "Finally, a campus app that doesn't look like it was built in 2005. The UI is gorgeous and the private chats are super fast." },
  { name: "Alex K.", role: "Engineering '24", text: "The anonymous confessions feature is hilarious. I love how secure and moderated it is. The dark mode is chefs kiss." },
  { name: "Priya R.", role: "Design '26", text: "As a design student, I appreciate the glassmorphism and smooth animations. It's the only app I use to stay connected with my clubs." },
  { name: "James L.", role: "Business '25", text: "Joined a study group through this app and we use the built-in video calls all the time. Crystal clear quality." },
];

const Testimonials = () => {
  const { data } = useCMSStore();
  const testimonials = data.testimonials?.length > 0 ? data.testimonials : defaultTestimonials;
  return (
    <section className="py-24 bg-[#000000] overflow-hidden relative border-t border-white/5">
      {/* Subtle background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF2E88]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-4xl font-bold text-center text-white">
          Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD]">Students</span>
        </h2>
      </div>

      <div className="relative w-full overflow-hidden flex">
        {/* Infinite Scroll Container */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          className="flex gap-6 px-6 w-max"
        >
          {/* Double the array for seamless looping */}
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div 
              key={idx} 
              className="w-[350px] shrink-0 bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:border-[#FF2E88]/30 transition-colors"
            >
              <div className="flex gap-1 text-[#FF2E88] mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4">
                {t.avatar && t.avatar.startsWith('http') ? (
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border border-white/10 object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-white/10 flex items-center justify-center font-bold text-white">
                    {t.name?.charAt(0) || 'S'}
                  </div>
                )}
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#000000] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#000000] to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default Testimonials;
