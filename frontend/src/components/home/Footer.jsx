import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/fi';
import useCMSStore from '../../store/cmsStore';

const Footer = () => {
  const { data } = useCMSStore();
  const footerData = data.footer || {};
  const socialLinks = data.socialLinks || [];
  const websiteSettings = data.websiteSettings || {};
  
  const siteName = websiteSettings?.siteName || 'Sharda Connect';
  const nameParts = siteName.split(' ');
  const firstPart = nameParts[0] || 'Sharda';
  const secondPart = nameParts.slice(1).join(' ') || 'Connect';
  return (
    <footer className="bg-[#000000] border-t border-white/5 pt-20 pb-10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6 flex items-center gap-2">
              {websiteSettings?.logoUrl && (
                <img src={websiteSettings.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
              )}
              <span className="text-2xl font-black text-white tracking-tighter">
                {firstPart}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E88] to-[#9D4EDD]">{secondPart}</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {footerData.description || 'The premier campus platform for students to chat privately, join communities, and stay connected securely.'}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link, idx) => {
                const IconComponent = Icons[link.icon] || Icons['FiLink'];
                return (
                  <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#FF2E88] hover:bg-white/10 transition-colors">
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links 1 */}
          {footerData.quickLinks?.length > 0 && (
            <div>
              <h4 className="text-white font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                {footerData.quickLinks.map((link, idx) => (
                  <li key={idx}><a href={link.path} className="hover:text-[#FF2E88] transition-colors">{link.label}</a></li>
                ))}
              </ul>
            </div>
          )}

          {/* Links 2 */}
          {footerData.companyLinks?.length > 0 && (
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                {footerData.companyLinks.map((link, idx) => (
                  <li key={idx}><a href={link.path} className="hover:text-[#FF2E88] transition-colors">{link.label}</a></li>
                ))}
              </ul>
            </div>
          )}

          {/* Links 3 */}
          {footerData.legalLinks?.length > 0 && (
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                {footerData.legalLinks.map((link, idx) => (
                  <li key={idx}><a href={link.path} className="hover:text-[#FF2E88] transition-colors">{link.label}</a></li>
                ))}
              </ul>
            </div>
          )}

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>{footerData.copyright || `© ${new Date().getFullYear()} Sharda Connect. All rights reserved.`}</p>
          <p className="mt-4 md:mt-0 flex items-center gap-1">
            {footerData.developerCredit ? (
              <span dangerouslySetInnerHTML={{ __html: footerData.developerCredit }} />
            ) : (
              <>Made with <span className="text-[#FF2E88]">❤️</span> for students</>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
