import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // to send cookies
});

// Add a request interceptor for Bearer tokens (Mobile Safari fix)
instance.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('user');
  const adminStr = localStorage.getItem('admin');
  
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  } else if (adminStr) {
    const admin = JSON.parse(adminStr);
    if (admin.token) config.headers.Authorization = `Bearer ${admin.token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
