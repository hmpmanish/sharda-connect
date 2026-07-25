import { Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import useThemeStore from './store/themeStore';
import LoadingSpinner from './components/LoadingSpinner';
import useCMSStore from './store/cmsStore';

// Layouts (Load eagerly as they are shells)
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Lazy-loaded Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Inbox = lazy(() => import('./pages/Inbox'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// DM Features
const FindStudents = lazy(() => import('./pages/connections/FindStudents'));
const Connections = lazy(() => import('./pages/connections/Connections'));
const ChatWindow = lazy(() => import('./pages/chat/ChatWindow'));
const CallHistory = lazy(() => import('./pages/chat/CallHistory'));

// Lazy-loaded Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminCMS = lazy(() => import('./pages/admin/cms/AdminCMS'));

function App() {
  const { theme } = useThemeStore();
  const { fetchCMSData, isLoading } = useCMSStore();

  useEffect(() => {
    fetchCMSData();
  }, [fetchCMSData]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Login (Outside layouts) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Routes (User) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/find-students" element={<FindStudents />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/chat" element={<ChatWindow />} />
            <Route path="/calls" element={<CallHistory />} />
          </Route>

          {/* Protected Routes (Admin - Totally Isolated) */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            <Route path="/admin/cms/*" element={<AdminCMS />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
