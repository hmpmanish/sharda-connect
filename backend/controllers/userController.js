import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        course: user.course,
        branch: user.branch,
        year: user.year,
        semester: user.semester,
        profilePhoto: user.profilePhoto,
        bio: user.bio,
        interests: user.interests,
        isProfileHidden: user.isProfileHidden,
        acceptAnonymousMessages: user.acceptAnonymousMessages,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.course = req.body.course || user.course;
      user.branch = req.body.branch || user.branch;
      user.year = req.body.year || user.year;
      user.semester = req.body.semester || user.semester;
      user.bio = req.body.bio || user.bio;
      user.profilePhoto = req.body.profilePhoto || user.profilePhoto;
      
      if (req.body.interests) {
        user.interests = req.body.interests;
      }
      
      if (req.body.isProfileHidden !== undefined) {
        user.isProfileHidden = req.body.isProfileHidden;
      }
      
      if (req.body.acceptAnonymousMessages !== undefined) {
        user.acceptAnonymousMessages = req.body.acceptAnonymousMessages;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        course: updatedUser.course,
        branch: updatedUser.branch,
        year: updatedUser.year,
        semester: updatedUser.semester,
        profilePhoto: updatedUser.profilePhoto,
        bio: updatedUser.bio,
        interests: updatedUser.interests,
        isProfileHidden: updatedUser.isProfileHidden,
        acceptAnonymousMessages: updatedUser.acceptAnonymousMessages,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
