import { useState } from 'react';
import useAuthStore from '../store/authStore';
import axios from '../utils/axios';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    course: user?.course || '',
    branch: user?.branch || '',
    year: user?.year || '',
    semester: user?.semester || '',
    bio: user?.bio || '',
    acceptAnonymousMessages: user?.acceptAnonymousMessages ?? true,
    isProfileHidden: user?.isProfileHidden ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data } = await axios.put('/users/profile', formData);
      updateUser(data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">
        Profile Settings
      </h1>

      {message && (
        <div className={`p-4 rounded-xl text-center ${message.includes('success') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/3 glass-card p-6 flex flex-col items-center text-center h-fit shadow-rose-500/10"
        >
          <div className="relative mb-4 group cursor-pointer" onClick={() => document.getElementById('profilePhotoInput').click()}>
            <img 
              src={formData.profilePhoto || user?.profilePhoto || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} 
              alt="Profile" 
              className="w-32 h-32 rounded-full border-4 border-primary/20 object-cover"
            />
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">Change Photo</span>
            </div>
            <input 
              type="file" 
              id="profilePhotoInput" 
              className="hidden" 
              accept="image/*" 
              capture="environment"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const uploadData = new FormData();
                uploadData.append('file', file);
                
                try {
                  const { data } = await axios.post('/media/upload/image', uploadData);
                  setFormData({ ...formData, profilePhoto: data.url });
                  setMessage('Photo uploaded! Click Save to apply.');
                  setTimeout(() => setMessage(''), 3000);
                } catch (err) {
                  setMessage('Failed to upload photo.');
                }
              }} 
            />
          </div>
          <h2 className="text-xl font-bold">{user?.fullName}</h2>
          <p className="text-light-muted dark:text-dark-muted">{user?.email}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-2/3 glass-card p-6 shadow-rose-500/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} className="input-field" placeholder="e.g. B.Tech" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="input-field" placeholder="e.g. CSE" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input type="text" name="year" value={formData.year} onChange={handleChange} className="input-field" placeholder="e.g. 3rd Year" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Semester</label>
                <input type="text" name="semester" value={formData.semester} onChange={handleChange} className="input-field" placeholder="e.g. 6th" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio (Confessions/Interests)</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                className="input-field min-h-[100px] resize-none" 
                placeholder="Share your interests, or drop a subtle hint..."
                maxLength="200"
              />
              <p className="text-xs text-right mt-1 text-light-muted">{formData.bio.length}/200</p>
            </div>

            <div className="border-t border-light-border dark:border-dark-border pt-6 space-y-4">
              <h3 className="font-semibold text-lg text-rose-500">Privacy & Receiving Settings</h3>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" name="acceptAnonymousMessages" checked={formData.acceptAnonymousMessages} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </div>
                <span className="font-medium">Accept Anonymous Secret Messages</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" name="isProfileHidden" checked={formData.isProfileHidden} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </div>
                <span className="font-medium">Hide Profile from Search</span>
              </label>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-primary px-8 shadow-rose-500/50" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
