import Settings from '../models/Settings.js';
import Content from '../models/Content.js';
import AuditLog from '../models/AuditLog.js';

// --- SETTINGS ---

// @desc    Get system settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({}); // create defaults if missing
    }
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private (SuperAdmin)
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
    }
    
    const updateData = req.body;
    Object.keys(updateData).forEach(key => {
      settings[key] = updateData[key];
    });

    await settings.save();

    await AuditLog.create({
      adminId: req.admin._id,
      actionType: 'SETTINGS_UPDATED',
      targetModel: 'Settings',
      targetId: settings._id,
      ipAddress: req.ip,
      details: `SuperAdmin updated system settings`
    });

    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
};

// --- CONTENT MANAGEMENT ---

// @desc    Get dynamic content page
// @route   GET /api/admin/content/:page
// @access  Private (Admin)
export const getContent = async (req, res, next) => {
  try {
    let content = await Content.findOne({ page: req.params.page });
    if (!content) {
      content = await Content.create({ page: req.params.page });
    }
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

// @desc    Update dynamic content
// @route   PUT /api/admin/content/:page
// @access  Private (SuperAdmin)
export const updateContent = async (req, res, next) => {
  try {
    const { title, body, isActive } = req.body;
    let content = await Content.findOne({ page: req.params.page });
    
    if (!content) {
      content = new Content({ page: req.params.page });
    }
    
    if (title !== undefined) content.title = title;
    if (body !== undefined) content.body = body;
    if (isActive !== undefined) content.isActive = isActive;

    await content.save();

    await AuditLog.create({
      adminId: req.admin._id,
      actionType: 'CONTENT_UPDATED',
      targetModel: 'Content',
      targetId: content._id,
      ipAddress: req.ip,
      details: `SuperAdmin updated content for page ${req.params.page}`
    });

    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

// --- AUDIT LOGS ---

// @desc    Get all audit logs
// @route   GET /api/admin/audit-logs
// @access  Private (SuperAdmin)
export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find({})
      .populate('adminId', 'name email role')
      .sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};
