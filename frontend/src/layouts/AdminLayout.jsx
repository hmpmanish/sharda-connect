import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  FiPieChart, FiUsers, FiMessageSquare, FiAlertCircle, 
  FiSettings, FiFileText, FiLogOut, FiSun, FiMoon, FiShield 
} from 'react-icons/fi';
import useAdminStore from '../store/adminStore';
import useThemeStore from '../store/themeStore';

const AdminLayout = () => {
  const { admin, isAdminAuthenticated, adminLogout } = useAdminStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const location = useLocation();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FiPieChart },
    { label: 'Website CMS', path: '/admin/cms', icon: FiFileText },
    { label: 'Users', path: '/admin/users', icon: FiUsers },
    { label: 'Messages', path: '/admin/messages', icon: FiMessageSquare },
    { label: 'Reports', path: '/admin/reports', icon: FiAlertCircle },
    { label: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  if (admin?.role === 'superadmin') {
    navItems.push({ label: 'Audit Logs', path: '/admin/audit-logs', icon: FiShield });
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} flex transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed h-screen z-50">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
            <FiShield className="w-8 h-8" />
            <div>
              <h1 className="font-bold text-xl leading-tight">Admin</h1>
              <p className="text-xs text-slate-500 font-medium">Super Panel</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex items-center space-x-3 bg-slate-100 dark:bg-slate-900 mx-4 mt-4 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-semibold text-sm">{admin?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{admin?.role}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button
            onClick={adminLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
