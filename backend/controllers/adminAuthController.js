import Admin from '../models/Admin.js';
import AuditLog from '../models/AuditLog.js';
import generateToken from '../utils/generateToken.js';

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');

    if (admin && (await admin.matchPassword(password))) {
      generateToken(res, admin._id);
      
      await AuditLog.create({
        adminId: admin._id,
        actionType: 'ADMIN_LOGIN',
        targetModel: 'Admin',
        targetId: admin._id,
        ipAddress: req.ip,
        details: 'Admin logged in'
      });

      res.status(200).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Seed super admin (one-time setup if needed)
// @route   POST /api/admin/auth/seed
// @access  Public
export const seedSuperAdmin = async (req, res, next) => {
  try {
    const { name, email, password, secretKey } = req.body;
    
    // Simple protection against random seeding
    if (secretKey !== 'SHARDA_SECRET_INIT') {
      res.status(403);
      throw new Error('Invalid secret key');
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      res.status(400);
      throw new Error('Admin already exists');
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: 'superadmin'
    });

    res.status(201).json({ message: 'Super admin created successfully', admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    next(error);
  }
};
