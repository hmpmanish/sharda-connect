import { create } from 'zustand';

const useAdminStore = create((set) => ({
  admin: JSON.parse(localStorage.getItem('admin')) || null,
  isAdminAuthenticated: !!localStorage.getItem('admin'),
  
  adminLogin: (adminData) => {
    localStorage.setItem('admin', JSON.stringify(adminData));
    set({ admin: adminData, isAdminAuthenticated: true });
  },
  
  adminLogout: () => {
    localStorage.removeItem('admin');
    set({ admin: null, isAdminAuthenticated: false });
  }
}));

export default useAdminStore;
