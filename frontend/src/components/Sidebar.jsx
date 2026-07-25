import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiInbox, 
  FiUser, 
  FiLogOut, 
  FiSun, 
  FiMoon, 
  FiX,
  FiHeart,
  FiUsers,
  FiMessageSquare,
  FiSearch,
  FiLogIn,
  FiPhone
} from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const location = useLocation();

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Find Students', path: '/find-students', icon: FiSearch },
    { name: 'Connections', path: '/connections', icon: FiUsers },
    { name: 'Direct Chat', path: '/chat', icon: FiMessageSquare },
    { name: 'Call History', path: '/calls', icon: FiPhone },
    { name: 'Secret Inbox', path: '/inbox', icon: FiInbox },
    { name: 'Profile', path: '/profile', icon: FiUser },
  ];

  return (
    <div className={`fixed md:sticky top-0 left-0 h-screen w-64 glass-card border-r border-light-border dark:border-dark-border flex flex-col z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="p-6 flex items-center justify-between md:hidden">
        <button className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-full transition-colors" onClick={closeSidebar}>
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <Link to="/" className="flex items-center space-x-3 mb-8 group" onClick={closeSidebar}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition-shadow">
            <FiHeart className="w-6 h-6 fill-white/20" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">Secret</h1>
            <p className="text-xs text-light-muted dark:text-dark-muted font-medium">Confessions</p>
          </div>
        </Link>

        {user && (
          <div className="mb-6 flex items-center space-x-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/10">
            <img 
              src={user.profilePhoto || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-rose-500/50 object-cover"
            />
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{user.fullName}</p>
              <p className="text-xs text-light-muted dark:text-dark-muted truncate">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="space-y-2">
          {userLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-light-hover dark:hover:bg-dark-hover hover:text-rose-500'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-rose-500' : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-light-border dark:border-dark-border space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-gray-600 dark:text-gray-400 hover:bg-light-hover dark:hover:bg-dark-hover transition-all text-left"
        >
          {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {user ? (
          <button
            onClick={() => {
              logout();
              closeSidebar();
            }}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-left"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            onClick={closeSidebar}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
          >
            <FiLogIn className="w-5 h-5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
