import Report from '../models/Report.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find({})
      .populate('reportedBy', 'fullName email')
      .populate('reportedMessage', 'content')
      .populate('targetDirectMessage', 'content sender conversationId')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status and add notes
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin)
export const updateReport = async (req, res, next) => {
  try {
    const { status, adminNotes, actionTaken } = req.body;
    const report = await Report.findById(req.params.id);

    if (report) {
      if (status) report.status = status;
      if (adminNotes) report.adminNotes = adminNotes;
      if (actionTaken) report.actionTaken = actionTaken;

      await report.save();

      await AuditLog.create({
        adminId: req.admin._id,
        actionType: 'REPORT_UPDATED',
        targetModel: 'Report',
        targetId: report._id,
        ipAddress: req.ip,
        details: `Admin updated report status to ${status}`
      });

      res.status(200).json(report);
    } else {
      res.status(404);
      throw new Error('Report not found');
    }
  } catch (error) {
    next(error);
  }
};
