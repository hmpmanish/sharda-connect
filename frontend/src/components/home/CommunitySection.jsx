import { motion } from 'framer-motion';

import useCMSStore from '../../store/cmsStore';

const defaultCommunities = [
  { name: 'Tech Club', membersCount: '1.2k', category: 'Clubs', bgColor: 'bg-blue-500/10', textColor: 'text-blue-500' },
  { name: 'Late Night Study', membersCount: '850', category: 'Study Groups', bgColor: 'bg-[#9D4EDD]/10', textColor: 'text-[#9D4EDD]' },
  { name: 'Campus Events', membersCount: '3.4k', category: 'Events', bgColor: 'bg-[#FF2E88]/10', textColor: 'text-[#FF2E88]' },
  { name: 'Confessions', membersCount: '5.2k', category: 'Discussions', bgColor: 'bg-red-500/10', textColor: 'text-red-500' },
  { name: 'Music Society', membersCount: '620', category: 'Clubs', bgColor: 'bg-green-500/10', textColor: 'text-green-500' },
  { name: 'CS 101 Help', membersCount: '400', category: 'Study Groups', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-500' },
];

const CommunitySection = () => {
  const { data } = useCMSStore();
  const communities = data.community?.length > 0 ? data.community : defaultCommunities;

  return (
    <section id="community" className="py-24 bg-[#0A0A0A] border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4 text-white"
            >
              Discover <span className="text-[#9D4EDD]">Communities</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 max-w-lg"
            >
              Join active groups, participate in campus discussions, or start your own club in seconds.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0 px-6 py-2.5 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
          >
            View All Groups
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, idx) => (
            <motion.div
              key={community._id || idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-[#050505] rounded-2xl p-6 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
            >
               <div className={`absolute -right-10 -top-10 w-32 h-32 ${community.bgColor || 'bg-[#9D4EDD]/10'} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
               
               <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${community.bgColor || 'bg-[#9D4EDD]/10'} ${community.textColor || 'text-[#9D4EDD]'}`}>
                 {community.category}
               </span>
               <h3 className="text-xl font-bold text-white mb-2">{community.name}</h3>
               <div className="flex items-center gap-2 text-gray-500 text-sm">
                 <div className="flex -space-x-2">
                   <div className="w-6 h-6 rounded-full bg-gray-700 border border-[#050505]"></div>
                   <div className="w-6 h-6 rounded-full bg-gray-600 border border-[#050505]"></div>
                   <div className="w-6 h-6 rounded-full bg-gray-500 border border-[#050505]"></div>
                 </div>
                 <span>{community.membersCount || community.members} Members</span>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
