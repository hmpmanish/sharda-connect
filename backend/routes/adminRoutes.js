import express from 'express';
import { adminProtect, requireSuperAdmin } from '../middlewares/authMiddleware.js';

import { loginAdmin, seedSuperAdmin } from '../controllers/adminAuthController.js';
import { getDashboardMetrics } from '../controllers/adminDashboardController.js';
import { getAllUsers, getUserDetails, updateUserStatus, resetUserPassword, deleteUser } from '../controllers/adminUserController.js';
import { getAllMessages, toggleArchiveMessage, deleteMessage } from '../controllers/adminMessageController.js';
import { getAllReports, updateReport } from '../controllers/adminReportController.js';
import { getSettings, updateSettings, getContent, updateContent, getAuditLogs } from '../controllers/adminSystemController.js';

const router = express.Router();

// --- AUTH ---
router.post('/auth/login', loginAdmin);
router.post('/auth/seed', seedSuperAdmin); // Initial seed

// --- APPLY MODERATOR/ADMIN PROTECTION TO ALL ROUTES BELOW ---
router.use(adminProtect);

// --- DASHBOARD ---
router.get('/dashboard/metrics', getDashboardMetrics);

// --- USERS ---
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/reset-password', requireSuperAdmin, resetUserPassword);
router.delete('/users/:id', requireSuperAdmin, deleteUser);

// --- MESSAGES ---
router.get('/messages', getAllMessages);
router.put('/messages/:id/archive', toggleArchiveMessage);
router.delete('/messages/:id', requireSuperAdmin, deleteMessage);

// --- REPORTS ---
router.get('/reports', getAllReports);
router.put('/reports/:id', updateReport);

// --- SETTINGS (SuperAdmin Only) ---
router.get('/settings', getSettings);
router.put('/settings', requireSuperAdmin, updateSettings);

// --- CONTENT (SuperAdmin Only) ---
router.get('/content/:page', getContent);
router.put('/content/:page', requireSuperAdmin, updateContent);

// --- AUDIT LOGS (SuperAdmin Only) ---
router.get('/audit-logs', requireSuperAdmin, getAuditLogs);

export default router;
