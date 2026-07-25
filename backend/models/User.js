import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    
    // Academic Profile Fields
    course: { type: String, trim: true, default: '' },
    branch: { type: String, trim: true, default: '' },
    year: { type: String, trim: true, default: '' },
    semester: { type: String, trim: true, default: '' },
    
    // Personal Profile Fields
    profilePhoto: {
      type: String,
      default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    bio: { type: String, trim: true, default: '', maxlength: 200 },
    interests: [{ type: String, trim: true }],
    
    // Privacy & Settings
    isProfileHidden: { type: Boolean, default: false },
    acceptAnonymousMessages: { type: Boolean, default: true },

    // Admin & Moderation tracking
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active'
    },
    loginHistory: [
      {
        ipAddress: String,
        browser: String,
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
