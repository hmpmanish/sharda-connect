import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

import useCMSStore from '../../store/cmsStore';

const defaultFaqs = [
  {
    question: "Is Sharda Connect only for Sharda University students?",
    answer: "Yes, currently the platform is exclusive to Sharda University students to ensure a safe, relevant, and close-knit community experience."
  },
  {
    question: "How does the Anonymous Confessions feature work?",
    answer: "When you send a confession, your identity is cryptographically hidden. Even the server logs don't tie your user account to the message, ensuring 100% anonymity."
  },
  {
    question: "Are my private chats really secure?",
    answer: "Absolutely. We use industry-standard encryption and JWT authentication. Your private messages are stored securely and are only accessible by you and the recipient."
  },
  {
    question: "Is there a mobile app?",
    answer: "Sharda Connect is built as a Progressive Web App (PWA). It is fully responsive and can be installed directly to your home screen from your mobile browser for an app-like experience."
  },
  {
    question: "How do I report toxic behavior?",
    answer: "Every message and post has a 'Report' button. Our advanced AI moderation also actively scans for and filters out hate speech and spam automatically."
  }
];

const FAQ = () => {
  const { data } = useCMSStore();
  const faqs = data.faqs?.length > 0 ? data.faqs : defaultFaqs;
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 bg-[#050505] border-t border-white/5 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Frequently Asked <span className="text-[#FF2E88]">Questions</span></h2>
          <p className="text-gray-400">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                key={faq._id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className="text-left font-semibold text-white text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#FF2E88] shrink-0 ml-4"
                  >
                    <FiChevronDown />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
